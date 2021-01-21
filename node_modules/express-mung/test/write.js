const should = require('should') // eslint-disable-line no-unused-vars
const express = require('express')
const request = require('supertest')
const mung = require('../')

describe('mung write', function() {
    const originalResponseTextBody = 'This is the response body'
    const modifiedResponseTextBody = 'This is the response body with more content'
    const originalResponseJSONBody = {
        a: 'a'
    }

    function appendText (chunk, encoding, req, res) {
        return chunk + ' with more content'
    }

    function inspectJson (chunk, encoding, req, res) {
        try {
            const json = JSON.parse(chunk)
            json.inspected_by = 'me'
            return JSON.stringify(json)
        } catch (e) {
            console.log('JSON parse error')
            throw e
        }
    }

    function noop (chunk, encoding, req, res) {
    }

    function error (chunk, encoding, req, res) {
        chunk.foo.bar.hopefully.fails()
    }

    function error403 (chunk, encoding, req, res) {
        res.status(403).json({ foo: 'bar ' })
    }

    it('should return the munged text result', function(done) {
        const server = express()
            .use(mung.write(appendText))
            .get('/', (req, res) => {
                res.status(200)
                    .write(originalResponseTextBody)
                res.end()
            })
        request(server)
            .get('/')
            .expect(200)
            .expect(res => {
                res.text.should.eql(modifiedResponseTextBody)
            })
            .end(done)
    })

    it('should return the munged text result with encoding', function(done) {
        const server = express()
            .use(mung.write(appendText))
            .get('/', (req, res) => {
                res.status(200)
                    .write(originalResponseTextBody, 'utf-8')
                res.end()
            })
        request(server)
            .get('/')
            .expect(200)
            .expect(res => {
                res.text.should.eql(modifiedResponseTextBody)
            })
            .end(done)
    })

    it('should return the same thing when no munge happens', function(done) {
        const server = express()
            .use(mung.write(noop))
            .get('/', (req, res) => {
                res.status(200)
                    .write(originalResponseTextBody)
                res.end()
            })
        request(server)
            .get('/')
            .expect(200)
            .expect(res => {
                res.text.should.eql(originalResponseTextBody)
            })
            .end(done)
    })

    it('should return a munged `body` when the content type is application/json', function(done) {
        const server = express()
            .use(mung.write(inspectJson))
            .get('/', (req, res) => {
                res.set('Content-Type', 'application/json')
                    .status(200)
                    .write(JSON.stringify(originalResponseJSONBody))
                res.end()
            })
        request(server)
            .get('/')
            .expect(200)
            .expect(res => {
                const expectedJSON = { a: 'a', inspected_by: 'me' }
                res.body.should.eql(expectedJSON)
            })
            .end(done)
    })

    it('should not mung an error response (by default)', function(done) {
        const server = express()
            .use(mung.write(appendText))
            .get('/', (req, res) => {
                res.status(404)
                    .write(originalResponseTextBody)
                res.end()
            })
        request(server)
            .get('/')
            .expect(404)
            .expect(res => {
                res.text.should.equal(originalResponseTextBody)
                res.body.should.deepEqual({})
            })
            .end(done)
    })

    it('should mung an error response when told to', function(done) {
        const server = express()
            .use(mung.write(appendText, { mungError: true }))
            .get('/', (req, res) => {
                res.status(404)
                    .write(originalResponseTextBody)
                res.end()
            })
        request(server)
            .get('/')
            .expect(404)
            .expect(res => {
                res.text.should.eql(modifiedResponseTextBody)
            })
            .end(done)
    })

    it('should abort if a response is sent', function(done) {
        const server = express()
            .use(mung.write(error403))
            .get('/', (req, res) => {
                res.set('Content-Type', 'application/json')
                    .status(200)
                    .write(originalResponseTextBody)
                res.end()
            })
        request(server)
            .get('/')
            .expect(403)
            .end(done)
    })

    it('should abort if a response is sent before the munge', function(done) {
        const server = express()
            .use(mung.write(noop))
            .get('/', (req, res) => {
                res.set('Content-Type', 'application/json')
                    .status(403)
                    .send({ message: 'oops' })
                    .write(originalResponseTextBody)
                res.end()
            })
        request(server)
            .get('/')
            .expect(403)
            .end(done)
    })

    it('should 500 on a synchronous exception', function(done) {
        const server = express()
            .use((err, req, res, next) => res.status(500).send(err.message).end())
            .use(mung.write(error))
            .get('/', (req, res) => {
                res.set('Content-Type', 'application/json')
                    .status(200)
                    .write(originalResponseTextBody)
                res.end()
            })
        request(server)
            .get('/')
            .expect(500)
            .end(done)
    })

    it('should 500 on an asynchronous exception', function(done) {
        const server = express()
            .use((err, req, res, next) => res.status(500).send(err.message).end())
            .use(mung.write(error))
            .get('/', (req, res) => {
                process.nextTick(() => {
                    res.set('Content-Type', 'application/json')
                        .status(200).write(originalResponseTextBody)
                    res.end()
                })
            })
        request(server)
            .get('/')
            .expect(500)
            .end(done)
    })
})

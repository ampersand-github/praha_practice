const should = require('should') // eslint-disable-line no-unused-vars
const express = require('express')
const request = require('supertest')
const mung = require('../')

describe('mung sendAsync', function() {
    const originalResponseTextBody = 'This is the response body'
    const modifiedResponseTextBody = 'This is the response body with more content'
    const originalResponseJSONBody = {
        a: 'a'
    }

    async function appendText (chunk, req, res) {
        return chunk + ' with more content'
    }

    async function inspectJson (chunk, req, res) {
        try {
            const json = JSON.parse(chunk)
            json.inspected_by = 'me'
            return JSON.stringify(json)
        } catch (e) {
            console.log('JSON parse error')
            throw e
        }
    }

    async function noop (chunk, req, res) {
    }

    function error (chunk, req, res) {
        chunk.foo.bar.hopefully.fails()
    }

    async function errorAsync (chunk, req, res) {
        chunk.foo.bar.hopefully.fails()
    }

    async function error403Async (chunk, req, res) {
        res.status(403).json({ foo: 'bar ' })
    }

    it('should return the munged text result', function(done) {
        const server = express()
            .use(mung.sendAsync(appendText))
            .get('/', (req, res) => {
                res.status(200)
                    .send(originalResponseTextBody)
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
            .use(mung.sendAsync(noop))
            .get('/', (req, res) => {
                res.status(200)
                    .send(originalResponseTextBody)
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
            .use(mung.sendAsync(inspectJson))
            .get('/', (req, res) => {
                res.set('Content-Type', 'application/json')
                    .status(200)
                    .send(JSON.stringify(originalResponseJSONBody))
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
            .use(mung.sendAsync(appendText))
            .get('/', (req, res) => {
                res.status(404)
                    .send(originalResponseTextBody)
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
            .use(mung.sendAsync(appendText, { mungError: true }))
            .get('/', (req, res) => {
                res.status(404)
                    .send(originalResponseTextBody)
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
            .use(mung.sendAsync(error403Async))
            .get('/', (req, res) => {
                res.set('Content-Type', 'application/json')
                    .status(200)
                    .send(originalResponseTextBody)
            })
        request(server)
            .get('/')
            .expect(403)
            .end(done)
    })

    it('should do nothing if a response is sent before munge', function(done) {
        const server = express()
            .use(mung.sendAsync(inspectJson))
            .get('/', (req, res) => {
                res.set('Content-Type', 'application/json')
                    .status(200)
                    .write('{"message": "oops"}')
                res.end()
            })
        request(server)
            .get('/')
            .expect(200)
            .end(done)
    })

    it('should 500 on a synchronous exception', function(done) {
        const server = express()
            .use((err, req, res, next) => res.status(500).send(err.message).end())
            .use(mung.sendAsync(error))
            .get('/', (req, res) => {
                res.set('Content-Type', 'application/json')
                    .status(200)
                    .send(originalResponseTextBody)
            })
        request(server)
            .get('/')
            .expect(500)
            .end(done)
    })

    it('should 500 on an asynchronous exception', function(done) {
        const server = express()
            .use((err, req, res, next) => res.status(500).send(err.message).end())
            .use(mung.sendAsync(errorAsync))
            .get('/', (req, res) => {
                process.nextTick(() => {
                    res.set('Content-Type', 'application/json')
                        .status(200).send(originalResponseTextBody)
                })
            })
        request(server)
            .get('/')
            .expect(500)
            .end(done)
    })
})

const should = require('should') // eslint-disable-line no-unused-vars
const express = require('express')
const request = require('supertest')
const mung = require('../')

describe('mung headers', function () {
    it('should return the munged headers', function(done) {
        function inspect (req, res) {
            res.set('x-inspected-by', 'me')
        }
        const server = express()
            .use(mung.headers(inspect))
            .get('/', (req, res) => res.status(200).json({ a: 'a' }).end())
        request(server)
            .get('/')
            .expect(200)
            .expect(res => {
                res.headers.should.have.property('x-inspected-by', 'me')
                res.body.should.eql({a: 'a'})
            })
            .end(done)
    })

    it('should work with promises', function(done) {
        async function inspect (req, res) {
            res.set('x-inspected-by', 'me')
        }
        const server = express()
            .use(mung.headersAsync(inspect))
            .get('/', (req, res) => res.status(200).json({ a: 'a' }).end())
        request(server)
            .get('/')
            .expect(200)
            .expect(res => {
                res.headers.should.have.property('x-inspected-by', 'me')
                res.body.should.eql({a: 'a'})
            })
            .end(done)
    })

    it('should 500 on a synchronous exception', function(done) {
        function error (req, res) {
            req.hopefully_fails()
        }
        const server = express()
            .use(mung.headers(error))
            .get('/', (req, res) => res.status(200).json({ a: 'a' }).end())
        request(server)
            .get('/')
            .expect(500)
            .end(done)
    })

    it('should 500 on an asynchronous exception', function(done) {
        async function error (req, res) {
            req.hopefully_fails()
        }
        const server = express()
            .use(mung.headersAsync(error))
            .get('/', (req, res) => res.status(200).json({ a: 'a' }).end())
        request(server)
            .get('/')
            .expect(500)
            .end(done)
    })

    it('should 500 on a synchronous exception with async method', function(done) {
        function error (req, res) {
            req.hopefully_fails()
        }
        const server = express()
            .use(mung.headersAsync(error))
            .get('/', (req, res) => res.status(200).json({ a: 'a' }).end())
        request(server)
            .get('/')
            .expect(500)
            .end(done)
    })

    it('should do nothing when headers are sent in munge', function(done) {
        function sendHeaders (req, res) {
            res.send({ message: 'oops' })
        }
        const server = express()
            .use(mung.headers(sendHeaders))
            .get('/', (req, res) => res.status(200).json({ a: 'a' }).end())
        request(server)
            .get('/')
            .expect(200)
            .end(done)
    })
})

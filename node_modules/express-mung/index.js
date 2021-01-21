const mung = {}
const fauxFin = { end: () => null }

function isScalar(v) {
    return typeof v !== 'object' && !Array.isArray(v)
}

mung.onError = (err, req, res) => {
    if (!res.headersSent) {
        res
            .status(500)
            .set('content-language', 'en')
            .json({ message: err.message })
            .end()
    }
    return res
}

mung.json = function json (fn, options = {}) {
    return function (req, res, next) {
        const original = res.json
        const mungError = options.mungError

        function jsonHook (json) {
            let originalJson = json
            res.json = original
            if (res.headersSent) { return res }
            if (!mungError && res.statusCode >= 400) { return original.call(this, json) }

            // Run the munger
            try {
                json = fn(json, req, res)
            } catch (e) {
                return mung.onError(e, req, res)
            }
            if (res.headersSent) { return res }

            // If no returned value from fn, then assume json has been mucked with.
            if (json === undefined) { json = originalJson }

            // If null, then 204 No Content
            if (json === null) { return res.status(204).end() }

            // If munged scalar value, then text/plain
            if (originalJson !== json && isScalar(json)) {
                res.set('content-type', 'text/plain')
                return res.send(String(json))
            }

            return original.call(this, json)
        }
        res.json = jsonHook

        next && next()
    }
}

mung.jsonAsync = function jsonAsync (fn, options = {}) {
    return function (req, res, next) {
        const original = res.json
        const mungError = options.mungError

        function jsonAsyncHook (json) {
            let originalJson = json
            res.json = original
            if (res.headersSent) { return }
            if (!mungError && res.statusCode >= 400) { return original.call(this, json) }
            try {
                fn(json, req, res)
                    .then(json => {
                        if (res.headersSent) { return }

                        // If null, then 204 No Content
                        if (json === null) { return res.status(204).end() }

                        // If munged scalar value, then text/plain
                        if (json !== originalJson && isScalar(json)) {
                            res.set('content-type', 'text/plain')
                            return res.send(String(json))
                        }

                        return original.call(this, json)
                    })
                    .catch(e => mung.onError(e, req, res))
            } catch (e) {
                mung.onError(e, req, res)
            }

            return fauxFin
        }
        res.json = jsonAsyncHook

        next && next()
    }
}

mung.headers = function headers (fn) {
    return function (req, res, next) {
        const original = res.end
        function headersHook () {
            res.end = original
            if (!res.headersSent) {
                try {
                    fn(req, res)
                } catch (e) {
                    return mung.onError(e, req, res)
                }
                if (res.headersSent) {
                    console.error('sending response while in mung.headers is undefined behaviour')
                    return
                }
            }
            return original.apply(this, arguments)
        }
        res.end = headersHook

        next && next()
    }
}

mung.headersAsync = function headersAsync (fn) {
    return function (req, res, next) {
        let original = res.end
        let onError = e => {
            res.end = original
            return mung.onError(e, req, res)
        }
        function headersAsyncHook (...args) {
            if (res.headersSent) { return original.apply(this, args) }
            res.end = () => null
            try {
                fn(req, res)
                    .then(() => {
                        res.end = original
                        if (res.headersSent) { return }
                        original.apply(this, args)
                    })
                    .catch(e => onError(e, req, res))
            } catch (e) {
                onError(e, req, res)
            }
        }
        res.end = headersAsyncHook

        next && next()
    }
}

mung.write = function write (fn, options = {}) {
    return function (req, res, next) {
        const original = res.write
        const mungError = options.mungError

        function writeHook (chunk, encoding, callback) {
            // If res.end has already been called, do nothing.
            if (res.headersSent) {
                return false
            }

            // Do not mung on errors
            if (!mungError && res.statusCode >= 400) {
                return original.apply(res, arguments)
            }

            try {
                let modifiedChunk = fn(
                    chunk,
                    // Since `encoding` is an optional argument to `res.write`,
                    // make sure it is a string and not actually the callback.
                    typeof encoding === 'string' ? encoding : null,
                    req,
                    res
                )

                // res.headersSent is set to `true` once res.end has been called.
                // If it is called in the mung function, stop execution here.
                if (res.headersSent) {
                    return false
                }

                // If no returned value from fn, then set it back to the original value
                if (modifiedChunk === undefined) {
                    modifiedChunk = chunk
                }

                return original.call(res, modifiedChunk, encoding, callback)
            } catch (err) {
                return mung.onError(err, req, res)
            }
        }

        res.write = writeHook

        next && next()
    }
}

mung.send = function send (fn, options = {}) {
    return function (req, res, next) {
        const original = res.send
        const mungError = options.mungError

        function sendHook (chunk) {
            // If res.end has already been called, do nothing.
            if (res.headersSent) { return res }

            // Do not mung on errors
            if (!mungError && res.statusCode >= 400) {
                return original.call(res, chunk)
            }

            try {
                let modifiedChunk = fn(
                    chunk,
                    req,
                    res
                )

                if (res.headersSent) { return res }
                // If no returned value from fn, then set it back to the original value
                if (modifiedChunk === undefined) {
                    modifiedChunk = chunk
                }

                original.call(res, modifiedChunk)
            } catch (e) {
                mung.onError(e, req, res)
            }

            return res
        }

        res.send = sendHook
        next && next()
    }
}

mung.sendAsync = function sendAsync (fn, options = {}) {
    return function (req, res, next) {
        const original = res.send
        const mungError = options.mungError

        function sendAsyncHook (chunk) {
            // If res.end has already been called, do nothing.
            if (res.headersSent) { return res }

            // Do not mung on errors
            if (!mungError && res.statusCode >= 400) {
                return original.call(res, chunk)
            }

            try {
                fn(
                    chunk,
                    req,
                    res
                ).then(modifiedChunk => {
                    if (res.headersSent) { return }
                    // If no returned value from fn, then set it back to the original value
                    if (modifiedChunk === undefined) {
                        modifiedChunk = chunk
                    }

                    original.call(res, modifiedChunk)
                }).catch(e => { mung.onError(e, req, res) })
            } catch (e) {
                mung.onError(e, req, res)
            }

            return fauxFin
        }

        res.send = sendAsyncHook
        next && next()
    }
}

module.exports = mung

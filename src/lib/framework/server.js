const http = require('http')
const { ApiError } = require('../../utils/error') // Importe a classe Router

class Server {
  server = null
  middlewares = []

  constructor (middlewares = []) {
    this.middlewares = middlewares
  }

  start = (port) => {
    this.server = http.createServer(this.handleRequest)
    this.server.listen(port, () => console.log(`Server listening on port ${port}`))
    return this
  }

  close = (cb) => this.server.close(cb)

  on = (evt, cb) => this.server.on(evt, cb)

  handleRequest = (req, res) => {
    let index = 0

    const next = (err) => {
      if (err) {
        return this.onError(err, res)
      }
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++]
        try {
          middleware(req, res, next)
        } catch (error) {
          return this.onError(error, res)
        }
      }
    }

    next()
  }

  onError (err, res) {
    let code = 500
    let body = { error: 'Internal Server Error' }
    if (err instanceof ApiError) {
      code = err.statusCode
      body = { error: err.message }
    }
    res.statusCode = code
    res.end(JSON.stringify(body))
  }
}

module.exports = Server

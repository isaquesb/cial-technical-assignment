const http = require('http')
const { ApiError } = require('../../utils/error') // Importe a classe Router

class Server {
  server = null
  middlewares = []

  constructor (middlewares = []) {
    this.middlewares = middlewares
    this.server = http.createServer(this.handleRequest)
    process.setMaxListeners(5)
  }

  start = (port) => {
    this.server.listen(port, () => console.log(`Server listening on port ${port}`))
    return this
  }

  close = (cb) => this.server.close(cb)

  on = (evt, cb) => this.server.on(evt, cb)

  handleError (err, res) {
    let code = 500
    let body = { error: 'Internal Server Error' + err }
    if (err instanceof ApiError) {
      code = err.statusCode
      body = { error: err.message }
    }
    res.statusCode = code
    res.end(JSON.stringify(body))

    process.removeAllListeners('uncaughtException')
  }

  handleRequest = (req, res) => {
    let index = 0
    res.setHeader('Content-Type', 'application/json')

    process.on('uncaughtException', error => this.handleError(error, res))

    const next = err => {
      if (err) {
        return this.handleError(err, res)
      }
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++]
        try {
          middleware(req, res, next)
        } catch (error) {
          this.handleError(error, res)
        }
      }
    }

    process.removeAllListeners('uncaughtException')
    next()
  }
}

module.exports = Server

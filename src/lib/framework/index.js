/**
 * Web framework implementation - write your code here
 *
 * This module should export your implementation of WebApp class.
 */
const Server = require('./server')

class WebApp {
  middlewares = []

  constructor () {
    this.use((req, res, next) => {
      console.log('Request received')
      console.log(req.method, req.url)
      next()
    })
  }

  use = (middleware) => this.middlewares.push(middleware)

  start = (port) => {
    const server = new Server(this.middlewares)
    server.start(port)
    return server
  }
}

module.exports = WebApp

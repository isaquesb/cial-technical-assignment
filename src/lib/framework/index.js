/**
 * Web framework implementation - write your code here
 *
 * This module should export your implementation of WebApp class.
 */
const Server = require('./server')
const jsonAccessLogMiddleware = require('./json-access-log')
class WebApp {
  middlewares = []
  server = null

  constructor () {
    this.use(jsonAccessLogMiddleware)
    this.server = new Server(this.middlewares)
  }

  use = (middleware) => this.middlewares.push(middleware)

  start = (port) => {
    this.server.start(port)
    return this.server
  }
}

module.exports = WebApp

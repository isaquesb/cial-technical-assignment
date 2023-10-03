module.exports = function jsonAccessLogMiddleware (req, res, next) {
  if (process.env.NODE_ENV === 'test') {
    next()
    return
  }
  const timestamp = new Date().toISOString()
  const method = req.method
  const url = req.url

  const logData = {
    timestamp,
    method,
    url
  }
  console.log(JSON.stringify(logData))
  next()
}

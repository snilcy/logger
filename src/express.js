import { debug } from './index.js'

export default (title = 'REST') => (req, res, next) => {
  req.port = res.socket.localPort

  debug(title, [
    req.method, [
      req.protocol,
      '://',
      req.hostname,
      ':',
      req.port,
      req.originalUrl
    ].join(''), req.body,
  ])

  next()
}

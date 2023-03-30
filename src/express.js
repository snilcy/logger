import logger from './main.js'

export const express = (title = 'REST') => (req, res, next) => {
  req.port = res.socket.localPort

  logger.debug(title, [
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

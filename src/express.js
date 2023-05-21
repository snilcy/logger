import { Logger, ConsoleDirection } from './index.js'

export const express = (title = 'REST') => {
  const logger = new Logger({
    directions: [new ConsoleDirection()],
    namespace: [title],
  })

  return (req, res, next) => {
    req.port = res.socket.localPort

    logger.debug(
      req.method, [
        req.protocol,
        '://',
        req.hostname,
        ':',
        req.port,
        req.originalUrl,
      ].join(''), req.body,
    )

    next()
  }
}

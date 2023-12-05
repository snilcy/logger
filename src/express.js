import { ConsoleDirection, Logger } from './index'

export const express = (title = 'REST') => {
  const logger = new Logger({
    directions: [new ConsoleDirection()],
    namespace: [title],
  })

  return (request, response, next) => {
    request.port = response.socket.localPort

    logger.debug(
      request.method,
      [
        request.protocol,
        '://',
        request.hostname,
        ':',
        request.port,
        request.originalUrl,
      ].join(''),
      request.body,
    )

    next()
  }
}

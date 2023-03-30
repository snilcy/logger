import chalk from 'chalk'
import { createLogger, format, transports } from 'winston'

const LABEL_MAP = {
  error: 'E',
  warn: 'W',
  info: 'I',
  debug: 'D',
}

const LABEL_COLORS = {
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.blue,
  debug: chalk.magenta,
}

const myFormat = format.printf(({ level, message, label, timestamp }) => {
  const text = [' -> ', LABEL_MAP[level] || level, ' : ', message].join('')
  const colorize = LABEL_COLORS[level]

  return colorize ? colorize(text) : text
})

const logger = createLogger({
  level: 'debug',
  format: myFormat,
  transports: [
    new transports.Console(),
  ],
})

const stringify = (data) => {
  if (Array.isArray(data)) {
    return data.map(stringify).join(' ')
  }

  if (typeof data === 'object') {
    if (Object.keys(data).length) {
      return JSON.stringify(data)
    }
    return ''
  }

  return data
}

const formatMessage = (message, data = {}) => [message, stringify(data)].join(' ')

const getLogger =
  (level) =>
    (message, data = {}) =>
      logger.log({
        level,
        message: formatMessage(message, data, level),
      })

export default {
  error: getLogger('error'),
  warn: getLogger('warn'),
  info: getLogger('info'),
  debug: getLogger('debug'),
}

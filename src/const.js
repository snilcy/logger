import chalk from 'chalk'

export const LoggerDirectionType = {
  CONSOLE: 1,
  FILE: 2
}

export const LoggerLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
}

export const LoggerMethodsMap = {
  [LoggerLevel.DEBUG]: 'debug',
  [LoggerLevel.INFO]: 'info',
  [LoggerLevel.WARN]: 'warn',
  [LoggerLevel.ERROR]: 'error',
}

export const LoggerSymbolMap = {
  [LoggerLevel.DEBUG]: 'D',
  [LoggerLevel.INFO]: 'I',
  [LoggerLevel.WARN]: 'W',
  [LoggerLevel.ERROR]: 'E',
}

export const LoggerColorMap = {
  [LoggerLevel.DEBUG]: chalk.magenta,
  [LoggerLevel.INFO]: chalk.blue,
  [LoggerLevel.WARN]: chalk.yellow,
  [LoggerLevel.ERROR]: chalk.red,
}

import chalk from 'chalk'

export enum LoggerDirectionType {
  CONSOLE,
  FILE,
}

export enum LoggerLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

export const LoggerMethodsMap = {
  [LoggerLevel.DEBUG]: 'debug',
  [LoggerLevel.ERROR]: 'error',
  [LoggerLevel.INFO]: 'info',
  [LoggerLevel.WARN]: 'warn',
} as const

export const LoggerSymbolMap = {
  [LoggerLevel.DEBUG]: 'D',
  [LoggerLevel.ERROR]: 'E',
  [LoggerLevel.INFO]: 'I',
  [LoggerLevel.WARN]: 'W',
} as const

export const LoggerColorMap = {
  [LoggerLevel.DEBUG]: chalk.magenta,
  [LoggerLevel.ERROR]: chalk.red,
  [LoggerLevel.INFO]: chalk.blue,
  [LoggerLevel.WARN]: chalk.yellow,
}

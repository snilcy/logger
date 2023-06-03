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

import { LoggerLevel } from './const.js'

export interface ILoggerMessage {
  level    : LoggerLevel
  data     : any
  namespace: string[]
}

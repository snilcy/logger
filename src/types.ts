import { LoggerLevel } from './const.js'

export interface ILoggerMessage {
  data: any
  level: LoggerLevel
  namespace: string[]
}

import { LoggerLevel } from './const.js'

export interface ILoggerMessage {
  level: LoggerLevel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  namespace: string[]
}

import { ILoggerMessage } from '../types.js'

export interface ILoggerDirection {
  act: (message: ILoggerMessage) => void
}

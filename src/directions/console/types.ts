import { ILoggerMessage } from '../../types'

export interface IConsoleDirectionOptions {
  align?: boolean
  color?: boolean
  deep?: number
  excludeKeys?: string[]
  excludePath?: string[]
  filterNs?: string[]
  format?: ((body: ILoggerMessage) => string) | null
  keys?: string[]
  length?: boolean
  lineTerminators?: boolean
  oneline?: boolean
  only?: string[]
  prefix?: string
  undefined?: boolean
}

import { ILoggerMessage } from '../../types'

import type { IConsoleDirectionOptions } from './types'

export const SHIFT = ' '.repeat(2)

export const MAX_OBJECT_KEYS_LENGTH = 5

export const MAX_DEEP_DEFAULT = 3

export const LINE_TERMINATORS_MAP: Record<string, string> = {
  '\n': '\\n',
  '\r': '\\r',
}

export const DEFAULT_OPTIONS: Required<IConsoleDirectionOptions> = {
  align: false,
  browser: true,
  color: true,
  deep: MAX_DEEP_DEFAULT,
  excludeKeys: [],
  excludePath: [],
  filterNs: [],
  format: null,
  keys: [],
  length: false,
  lineTerminators: false,
  node: true,
  oneline: false,
  only: [],
  prefix: '->',
  undefined: true,
}

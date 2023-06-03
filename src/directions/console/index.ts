import type { ILoggerDirection } from '../types.js'
import type { ILoggerMessage } from '../../types.js'
import type { IConsoleDirectionOptions } from './types.js'

import { LoggerColorMap } from '../../const.js'
import { Chalk } from 'chalk'

import {
  getConstructorName,
  isArray,
  isError,
  isNull,
  isUndefined,
  merge,
} from '@snilcy/cake'

import {
  SHIFT,
  MAX_OBJECT_KEYS_LENGTH,
  LINE_TERMINATORS_MAP,
  DEFAULT_OPTIONS,
} from './const.js'

export class ConsoleDirection implements ILoggerDirection {
  private options: IConsoleDirectionOptions = DEFAULT_OPTIONS

  constructor(options: IConsoleDirectionOptions) {
    this.options = merge(this.options, options)
  }

  private format(body: ILoggerMessage) {
    if (this.options.format) {
      return this.options.format(body)
    }

    const { level, data, namespace } = body

    return [
      LoggerColorMap[level](this.options.prefix),
      namespace,
      ConsoleDirection.stringify(data, this.options),
    ]
      .filter(Boolean)
      .flat(3)
      .join(' ')

  }

  act(body: ILoggerMessage) {
    const content = this.format(body)
    console.log(content)
  }

  static stringify = (data: ILoggerMessage['data'], options: IConsoleDirectionOptions = DEFAULT_OPTIONS, currentDeep = 0): string => {
    if (options) {
      options = merge(DEFAULT_OPTIONS, options)
    }

    const newLineSym = options.oneline ? '' : '\n'
    const chalk = new Chalk({ level: options.color ? 3 : 0 })

    const TypeHandler = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      object: (obj: any) => {
        const props: string[] = []
        const keys = Object.keys(obj)
        const maxLengthItem = keys.sort((a, b) => b.length - a.length)[0]

        keys.sort()

        if (isError(obj)) {
          keys.unshift('message')
        }


        for (const key of keys) {
          const value = obj[key]
          const optionsKeys = options.keys.concat(key)
          const optionsKeysStr = optionsKeys.join('.')

          if (
            (isUndefined(value) && !options.undefined) || //          undefined
            options.excludePath.includes(optionsKeysStr) || //        exclude path
            options.excludeKeys.includes(key) || //                   exclude keys
            options.only.length && !options.only.find((onlyKey) => // only
              onlyKey.startsWith(optionsKeysStr) ||
              optionsKeysStr.startsWith(onlyKey))
          ) {
            continue
          }

          const resValue = ConsoleDirection.stringify(
            value,
            merge(options, { keys: optionsKeys }),
            currentDeep + 1,
          )

          props.push([
            options.oneline ? '' : SHIFT.repeat(currentDeep),
            key,
            chalk.gray(':'),
            options.oneline || !options.align ? ' ' : chalk.gray('.'.repeat(1 + maxLengthItem.length - key.length)),
            resValue,
          ].join(''))
        }

        const cnstrName = getConstructorName(obj) === 'Object' ? '' : `${getConstructorName(obj) } `
        const colorConstrName = isError(obj) ? chalk.red(cnstrName) : chalk.magenta(cnstrName)

        if (!props.length) {
          return chalk.magenta(`${colorConstrName}{}`)
        }

        if (options.deep && currentDeep >= options.deep) {
          return chalk.magenta([
            colorConstrName,
            '{',
            keys.length > MAX_OBJECT_KEYS_LENGTH ? `#${keys.length}` : keys.join(', '),
            '}',
          ].filter(Boolean).join(' '))
        }

        return [
          colorConstrName + chalk.gray('{'),
          props.join(chalk.gray(`,${ newLineSym}`)) ,
          (options.oneline ? '' : SHIFT.repeat(Math.max(currentDeep - 1, 0))) +
          chalk.gray('}'),
        ].join(newLineSym)
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      array: (arr: any[]) => {
        if (!arr.length) {
          return chalk.magenta('[]')
        }


        if (options.deep && currentDeep >= options.deep) {
          return chalk.magenta(`[ #${ arr.length} ]`)
        }

        const content = arr
          .map((el) => ConsoleDirection.stringify(el, options, currentDeep + 1))
          .join(chalk.gray(', '))

        return [
          chalk.gray('['),
          content,
          chalk.gray(']'),
        ].join('')
      },
      null: () => chalk.red('null'),
      boolean: (bool: boolean) => chalk.yellow(bool),
      number: (num: number) => chalk.blue(num),
      undefined: (und: undefined) => chalk.gray(und),
      string: (str: string) => {
        if (options.lineTerminators) {
          str = str.replace(/\s/g,(sym) => LINE_TERMINATORS_MAP[sym] || sym)
        }

        return chalk.green(str)
      },
      // eslint-disable-next-line @typescript-eslint/ban-types
      function: (fn: Function) => {
        const result = [fn.name || '(anonymous)']

        if (Object.getPrototypeOf(fn)) {
          result.push(Object.getPrototypeOf(fn).name)
        }

        return chalk.magenta(result.filter(Boolean).join(' <  '))
      },
      bigint: (val: bigint) => val.toString(),
      symbol: (val: symbol) => val.toString(),
    }

    if (isNull(data)) {
      return TypeHandler.null()
    }

    if (isArray(data)) {
      return TypeHandler.array(data)
    }

    const type = typeof data
    const typeHandler = TypeHandler[type]

    return typeHandler(data)
  }
}

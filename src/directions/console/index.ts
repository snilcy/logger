import type { ILoggerDirection } from '../types'
import type { ILoggerMessage } from '../../types'
import type { IConsoleDirectionOptions } from './types'

import { LoggerColorMap } from '../../const'
import { Chalk } from 'chalk'

import {
  getConstructorName,
  isArray,
  isError,
  isNull,
  isUndefined,
  shallowMerge,
} from '@snilcy/cake'

import {
  SHIFT,
  LINE_TERMINATORS_MAP,
  DEFAULT_OPTIONS,
} from './const'

export class ConsoleDirection implements ILoggerDirection {
  private options: IConsoleDirectionOptions = DEFAULT_OPTIONS

  constructor(options: IConsoleDirectionOptions) {
    this.options = shallowMerge(this.options, options)
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

  static stringify = (
    data: ILoggerMessage['data'],
    options: IConsoleDirectionOptions = DEFAULT_OPTIONS,
    currentDeep = 0,
  ): string => {
    if (options) {
      options = shallowMerge(DEFAULT_OPTIONS, options)
    }

    const chalk = new Chalk({
      level: options.color
        ? 3
        : 0,
    })

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
          const optionsKeys = (options.keys || []).concat(key)
          const optionsKeysStr = optionsKeys.join('.')

          if (isUndefined(value) && !options.undefined) {
            continue
          }

          if (
            options.excludePath &&
            options.excludePath.includes(optionsKeysStr)
          ) {
            continue
          }

          if (options.excludeKeys && options.excludeKeys.includes(key)) {
            continue
          }

          if (
            options.only &&
            options.only.length &&
            !options.only.find(
              (
                onlyKey, // only
              ) =>
                onlyKey.startsWith(optionsKeysStr) ||
                optionsKeysStr.startsWith(onlyKey),
            )
          ) {
            continue
          }

          const resValue = ConsoleDirection.stringify(
            value,
            shallowMerge(options, { keys: optionsKeys }),
            currentDeep + 1,
          )

          props.push(
            [
              options.oneline ? '' : SHIFT.repeat(currentDeep),
              key,
              chalk.gray(':'),
              options.oneline || !options.align
                ? ' '
                : chalk.gray('.'.repeat(1 + maxLengthItem.length - key.length)),
              resValue,
            ].join(''),
          )
        }

        const constrName =
          getConstructorName(obj) === 'Object'
            ? ''
            : `${getConstructorName(obj)} `

        const colorConstrName = isError(obj)
          ? chalk.red(constrName)
          : chalk.magenta(constrName)

        const newLineSym = options.oneline ? '' : '\n'
        const closeRhift = options.oneline
          ? ''
          : SHIFT.repeat(Math.max(currentDeep - 1, 0))

        let content = props.length
          ? [
              '',
              props.join(chalk.gray(`,${newLineSym}`)),
              closeRhift,
            ].join(
              newLineSym,
            )
          : ''

        if (options.deep && currentDeep >= options.deep) {
          content = chalk.gray(' ... ')
        }

        const length = options.length ? chalk.gray(`#${props.length} `) : ''

        return [
          colorConstrName,
          length,
          chalk.gray('{'),
          content,
          chalk.gray('}'),
        ].join('')
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      array: (arr: any[]) => {
        let content = arr
          .map((el) => ConsoleDirection.stringify(el, options, currentDeep + 1))
          .join(chalk.gray(', '))

        if (options.deep && currentDeep >= options.deep) {
          content = chalk.gray(' ... ')
        }

        const constrName = getConstructorName(arr)
        const length = options.length ? chalk.gray(`#${arr.length} `) : ''

        return [
          constrName === 'Array' ? '' : constrName,
          length,
          chalk.gray('['),
          content,
          chalk.gray(']'),
        ].join('')
      },
      null     : () => chalk.red('null'),
      boolean  : (bool: boolean) => chalk.yellow(bool),
      number   : (num: number) => chalk.blue(num),
      undefined: (und: undefined) => chalk.gray(und),
      string   : (str: string) => {
        if (options.lineTerminators) {
          str = str.replace(/\s/g, (sym) => LINE_TERMINATORS_MAP[sym] || sym)
        }

        const length = options.length ? chalk.gray(`#${str.length} `) : ''

        return [
          length,
          chalk.gray("'"),
          chalk.green(str),
          chalk.gray("'"),
        ].join('')
      },
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

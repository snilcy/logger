/* eslint-disable unicorn/explicit-length-check */
import {
  getConstructorName,
  isArray,
  isBrowserEnvironment,
  isError,
  isNodeEnvironment,
  isNull,
  isUndefined,
  shallowMerge,
} from '@snilcy/cake'
import { Chalk } from 'chalk'

import { LoggerColorMap, LoggerMethodsMap } from '../../const'

import { DEFAULT_OPTIONS, LINE_TERMINATORS_MAP, SHIFT } from './const'

import type { ILoggerMessage } from '../../types'
import type { ILoggerDirection } from '../types'

import type { IConsoleDirectionOptions } from './types'

export class ConsoleDirection implements ILoggerDirection {
  private options: Required<IConsoleDirectionOptions> = DEFAULT_OPTIONS

  constructor(options: IConsoleDirectionOptions) {
    this.options = shallowMerge(this.options, options)
    // console.log('ConsoleDirection.constructor', this.options)
  }

  private format(body: ILoggerMessage) {
    if (this.options.format) {
      return this.options.format(body)
    }

    const { data, level, namespace } = body

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
    if (!this.options.browser && isBrowserEnvironment()) return
    if (!this.options.node && isNodeEnvironment()) return

    if (isBrowserEnvironment()) {
      const level = LoggerMethodsMap[body.level]
      console[level]([...body.namespace, body.data[0]].join('.'), body.data[1])
      return
    }

    const content = this.format(body)
    console.log(content)
  }

  static stringify = (
    data: ILoggerMessage['data'],
    options: Required<IConsoleDirectionOptions> = DEFAULT_OPTIONS,
    currentDeep = 0,
    objectCache = new Map<object, any>(),
  ): string => {
    if (options) {
      options = shallowMerge(DEFAULT_OPTIONS, options)
    }

    const chalk = new Chalk({
      level: options.color ? 3 : 0,
    })

    if (objectCache.has(data)) {
      return chalk.blueBright(
        ['Circular<', getConstructorName(data), '>'].join(''),
      )
    }

    const TypeHandler = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      array: (array: any[]) => {
        let content = array
          .map((element) =>
            ConsoleDirection.stringify(
              element,
              options,
              currentDeep + 1,
              objectCache,
            ),
          )
          .join(chalk.gray(', '))

        if (options.deep && currentDeep >= options.deep) {
          content = chalk.gray(' ... ')
        }

        const constrName = getConstructorName(array)
        // eslint-disable-next-line unicorn/explicit-length-check
        const length = options.length ? chalk.gray(`#${array.length} `) : ''

        return [
          constrName === 'Array' ? '' : constrName,
          length,
          chalk.gray('['),
          content,
          chalk.gray(']'),
        ].join('')
      },
      bigint: (value: bigint) => value.toString(),
      boolean: (bool: boolean) => chalk.yellow(bool),
      // eslint-disable-next-line @typescript-eslint/ban-types
      function: (functionToColorize: Function) => {
        const result = [functionToColorize.name || '(anonymous)']

        if (Object.getPrototypeOf(functionToColorize)) {
          result.push(Object.getPrototypeOf(functionToColorize).name)
        }

        return chalk.magenta(result.filter(Boolean).join(' <  '))
      },
      null: () => chalk.red('null'),
      number: (numberToColorize: number) => chalk.blue(numberToColorize),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      object: (object: any) => {
        const props: string[] = []
        const keys = Object.keys(object)
        const maxLengthItem = keys.sort((a, b) => b.length - a.length)[0]

        keys.sort()

        if (isError(object)) {
          keys.unshift('message')
        }

        for (const key of keys) {
          const value = object[key]
          const optionsKeys = [...options.keys, key]
          const optionsKeysString = optionsKeys.join('.')

          if (isUndefined(value) && !options.undefined) {
            continue
          }

          if (
            options.only &&
            options.only.length > 0 &&
            !options.only.some(
              (
                onlyKey, // only
              ) =>
                onlyKey.startsWith(optionsKeysString) ||
                optionsKeysString.startsWith(onlyKey),
            )
          ) {
            continue
          }

          let resultValue = ConsoleDirection.stringify(
            value,
            shallowMerge(options, { keys: optionsKeys }),
            currentDeep + 1,
            objectCache,
          )

          if (
            options.excludePath &&
            options.excludePath.includes(optionsKeysString)
          ) {
            resultValue = chalk.gray('excludePath')
          } else if (options.excludeKeys && options.excludeKeys.includes(key)) {
            resultValue = chalk.gray('excludeKeys')
          } else {
            objectCache.set(data, true)
          }

          props.push(
            [
              options.oneline ? '' : SHIFT.repeat(currentDeep),
              key,
              chalk.gray(':'),
              options.oneline || !options.align
                ? ' '
                : chalk.gray('.'.repeat(1 + maxLengthItem.length - key.length)),
              resultValue,
            ].join(''),
          )
        }

        const constrName =
          getConstructorName(object) === 'Object'
            ? ''
            : `${getConstructorName(object)} `

        const colorConstrName = isError(object)
          ? chalk.red(constrName)
          : chalk.magenta(constrName)

        const newLineSym = options.oneline ? '' : '\n'
        const closeBracketShift = options.oneline
          ? ''
          : SHIFT.repeat(Math.max(currentDeep - 1, 0))

        let content =
          props.length > 0
            ? [
                '',
                props.join(chalk.gray(`,${newLineSym}`)),
                closeBracketShift,
              ].join(newLineSym)
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
      string: (stringToColorize: string) => {
        if (options.lineTerminators) {
          stringToColorize = stringToColorize.replaceAll(
            /\s/g,
            (sym) => LINE_TERMINATORS_MAP[sym] || sym,
          )
        }

        const length = options.length
          ? chalk.gray(`#${stringToColorize.length} `)
          : ''

        return [
          length,
          chalk.gray("'"),
          chalk.green(stringToColorize),
          chalk.gray("'"),
        ].join('')
      },
      symbol: (value: symbol) => value.toString(),
      undefined: (und: undefined) => chalk.gray(und),
    }

    if (isNull(data)) {
      return TypeHandler.null()
    }

    if (isArray(data)) {
      return TypeHandler.array(data)
    }

    const type = typeof data
    const typeHandler = TypeHandler[type] as (typeof TypeHandler)['number']

    return typeHandler(data)
  }
}

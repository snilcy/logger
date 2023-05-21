import { LoggerDirection } from './common.js'
import { LoggerColorMap } from '../const.js'
import { Chalk } from 'chalk'
import {
  getConstructorName,
  isObject,
  isArray,
  isError,
  isNull,
  isUndefined,
  deepMerge,
} from '@snilcy/cake'

const SHIFT = ' '.repeat(2)
const MAX_OBJECT_KEYS_LENGTH = 5
const MAX_DEEP_DEFAULT = 3
const LINE_TERMINATORS_MAP = {
  '\r': '\\r',
  '\n': '\\n',
}

export class ConsoleDirection extends LoggerDirection {
  constructor(options = {}) {
    super()
    this.options = deepMerge({
      prefix: '->',
    }, options)
  }

  #format(body) {
    if (this.options.format) {
      return this.options.format(body)
    }

    const { level, text, namespace } = body

    return [
      LoggerColorMap[level](this.options.prefix),
      namespace,
      ConsoleDirection.stringify(text, this.options),
    ]
      .filter(Boolean)
      .flat(3)
      .join(' ')

  }

  act(body, options) {
    if (options) {
      this.options = deepMerge({}, this.options, options)
    }

    const content = this.#format(body)
    console.log(content)
  }

  static stringify = (data, options = {}) => {
    options = deepMerge({
      deep: MAX_DEEP_DEFAULT,
      _deep: 0,
      color: true,
      oneline: false,
      align: false,
      undefined: true,
      keys: [],
      exclude: [],
      only: [],
      lineTerminators: false,
    }, options)

    const newLineSym = options.oneline ? '' : '\n'
    const chalk = new Chalk({ level: options.color ? 3 : 0 })

    const TypeHandler = {
      object: (obj) => {
        const props = []
        const keys = Object.keys(obj)
        const maxLengthItem = keys.sort((a, b) => b.length - a.length)[0]

        keys.sort()

        if (isError(obj)) {
          keys.unshift('message')
        }

        for (const key of keys) {
          const value = obj[key]
          const valueKeys = Object.keys(value || {})
          const valueConstructor = getConstructorName(value) === 'Object' ? '' : `${getConstructorName(value) } `
          const optionsKeys = options.keys.concat(key)
          const optionsKeysStr = optionsKeys.join('.')

          if (
            (isUndefined(value) && !options.undefined) || // undefined option
            options.exclude.includes(optionsKeysStr) || // exclude option
            options.only.length && !options.only.find((onlyKey) =>
              onlyKey.startsWith(optionsKeysStr) ||
              optionsKeysStr.startsWith(onlyKey))
          ) {
            continue
          }

          const shortObject = chalk.magenta([
            valueConstructor,
            '{ ',
            valueKeys.length > MAX_OBJECT_KEYS_LENGTH ? `#${ valueKeys.length}` : valueKeys,
            ' }',
          ].join(''))

          const resValue =
            options._deep > options.deep &&
            isObject(value) &&
            valueKeys.length ?
              shortObject :
              ConsoleDirection.stringify(
                value,
                deepMerge({}, options, {
                  keys: optionsKeys,
                  _deep: options._deep + 1,
                }),
              )

          props.push([
            options.oneline ? '' : SHIFT.repeat(options._deep),
            key,
            chalk.gray(':'),
            options.oneline || !options.align ? ' ' : chalk.gray('.'.repeat(1 + maxLengthItem.length - key.length)),
            resValue,
          ].join(''))
        }

        if (!props.length) {
          return chalk.magenta('{}')
        }

        const cnstrName = getConstructorName(obj) === 'Object' ? '' : `${getConstructorName(obj) } `
        const colorConstrName = isError(obj) ? chalk.red(cnstrName) : chalk.magenta(cnstrName)

        return [
          colorConstrName + chalk.gray('{'),
          props.join(chalk.gray(`,${ newLineSym}`)),
          (options.oneline ? '' : SHIFT.repeat(Math.max(options._deep - 1, 0))) +
          chalk.gray('}'),
        ].join(newLineSym)
      },
      array: (arr) => {
        const content = arr
          .map((el) => ConsoleDirection.stringify(
            el,
            deepMerge({}, options, { _deep: options._deep + 1 }),
          ))
          .join(chalk.gray(', '))

        return [
          chalk.gray('['),
          content,
          chalk.gray(']'),
        ].join('')
      },
      null: () => chalk.red('null'),
      boolean: (bool) => chalk.yellow(bool),
      number: (num) => chalk.blue(num),
      undefined: (und) => chalk.gray(und),
      string: (str) => {
        if (options.lineTerminators) {
          str = str.replace(/\s/g,(sym) => LINE_TERMINATORS_MAP[sym] || sym)
        }

        return chalk.green(`'${str}'`)
      },
      function: (fn) => {
        const result = [fn.name || '(anonymous)']

        if (Object.getPrototypeOf(fn)) {
          result.push(Object.getPrototypeOf(fn).name)
        }

        return chalk.magenta(result.filter(Boolean).join(' <  '))
      },
    }

    if (isNull(data)) {
      return TypeHandler.null()
    }

    if (isArray(data)) {
      return TypeHandler.array(data)
    }

    const type = typeof data

    if (TypeHandler[type]) {
      return TypeHandler[type](data)
    }

    return Object.prototype.toString.call(data)
  }
}

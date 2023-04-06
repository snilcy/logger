import { LoggerDirection } from './common.js'
import { LoggerColorMap } from '../const.js'
import { Chalk } from 'chalk'
import { getConstructorName } from '@snilcy/cake'

const SHIFT = ' '.repeat(2)
const MAX_OBJECT_KEYS_LENGTH = 5
const MAX_DEEP_DEFAULT = 2

export class ConsoleDirection extends LoggerDirection {
  constructor(options = {}) {
    super()
    this.prefix = options.prefix ?? '->'
    // this.indent = options.indent ?? 2
    this.color = options.color
    this.oneline = options.oneline
    this.format = options.format
    this.deep = options.deep
    this.align = options.align
  }

  #format(body) {
    if (this.format) {
      return this.format(body)
    }

    const { level, text, namespace } = body
    // const indent = ' '.repeat(this.indent * namespace.length)

    return [
      // indent,
      LoggerColorMap[level](this.prefix),
      namespace,
      ConsoleDirection.stringify(text, {
        color: this.color,
        oneline: this.oneline,
        maxDeep: this.deep,
        align: this.align,
      }),
    ]
      .filter(Boolean)
      .flat(3)
      .join(' ')

  }

  act(body) {
    const content = this.#format(body)
    console.log(content)
  }

  static stringify = (data, options = {}) => {
    const maxDeep = options.maxDeep || MAX_DEEP_DEFAULT
    const deep = options.deep ?? 0
    const color = options.color ?? true
    const oneline = options.oneline ?? false
    const align = options.align ?? false
    const chalk = new Chalk({ level: color ? 3 : 0 })
    const newLineSym = options.oneline ? '' : '\n'

    const TypeHandler = {
      object: (obj) => {
        if (obj === null) {
          return chalk.red('null')
        }

        const props = []
        const keys = Object.keys(obj)
        const maxLengthItem = keys.sort((a, b) => b.length - a.length)[0]
        keys.sort()

        for (const key of keys) {
          const value = obj[key]
          const valueKeys = Object.keys(value || {})
          const valueConstructor = getConstructorName(value) === 'Object' ? '' : `${getConstructorName(value) } `

          const resValue = deep > maxDeep &&
          typeof value === 'object' &&
          value !== null &&
          valueKeys.length ?
            chalk.magenta([
              valueConstructor,
              '{ ',
              valueKeys.length > MAX_OBJECT_KEYS_LENGTH ? `#${ valueKeys.length}` : valueKeys,
              ' }',
            ].join('')) :
            ConsoleDirection.stringify(value, {
              maxDeep,
              deep: deep + 1,
              color,
              oneline,
              align,
            })

          props.push([
            oneline ? '' : SHIFT.repeat(deep),
            key,
            chalk.gray(':'),
            oneline || !align ? ' ' : chalk.gray('.'.repeat(1 + maxLengthItem.length - key.length)),
            resValue,
          ].join(''))
        }

        if (!props.length) {
          return chalk.magenta('{}')
        }

        const constructor = obj.constructor.name === 'Object' ? '' : `${obj.constructor.name } `

        return [ chalk.gray(`${constructor}{`),
          props.join(chalk.gray(`,${ newLineSym}`)),
          (oneline ? '' : SHIFT.repeat(Math.max(deep - 1, 0))) +
          chalk.gray('}'),
        ].join(newLineSym)
      },
      array: (arr) => arr
        .map((el) => ConsoleDirection.stringify(el, {
          maxDeep,
          deep: deep + 1,
          color,
          oneline,
          align,
        }))
        .join(chalk.gray(', ')),
      boolean: (bool) => chalk.yellow(bool),
      number: (num) => chalk.blue(num),
      undefined: (und) => chalk.gray(und),
      string: (str) => chalk.green(`'${str}'`),
      function: (fn) => {
        const result = [fn.name || '(anonymous)']

        if (Object.getPrototypeOf(fn)) {
          result.push(Object.getPrototypeOf(fn).name)
        }

        return chalk.magenta(result.filter(Boolean).join(' <  '))
      },
    }

    if (Array.isArray(data)) {
      return TypeHandler.array(data)
    }

    const type = typeof data

    if (TypeHandler[type]) {
      return TypeHandler[type](data)
    }

    return Object.prototype.toString.call(data)
  }
}

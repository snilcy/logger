import { LoggerDirection } from './common.js'
import { LoggerColorMap } from '../const.js'
import { stringify } from './utils.js'

export class ConsoleDirection extends LoggerDirection {
  constructor(options = {}) {
    super()
    this.prefix = options.prefix ?? '->'
    this.indent = options.indent ?? 2
    this.color = options.color ?? true
    this.format = options.format
  }

  #format(body) {
    if (this.format) {
      return this.format(body)
    }

    const { level, text, namespace } = body
    const colorize = this.color ? LoggerColorMap[level] : (a) => a
    const indent = ' '.repeat(this.indent * namespace.length)

    return colorize(
      [
        indent,
        this.prefix,
        namespace,
        stringify(text),
      ]
        .filter((el) => {
          if (typeof el === 'string') {
            return el.length
          }

          return true
        })
        .flat(3)
        .join(' '),
    )
  }

  act(body) {
    const content = this.#format(body)
    console.log(content)
  }
}

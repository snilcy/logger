import { LoggerLevel } from './const.js'

export class Logger {
  options = {}
  disabled = false
  namespace = []

  constructor(options = {}) {
    this.options = options
    this.namespace = [this.options.namespace]
      .filter(Boolean)
      .flat(3)
  }

  #message({ level, text }) {
    if (this.disabled) {
      return
    }

    this.options.directions.forEach((direction) => {
      direction.act({
        level,
        text,
        namespace: this.namespace,
      })
    })
  }

  ns(value) {
    const options = this.options
    options.namespace = this.namespace.concat(value)
    return new Logger(options)
  }


  log(level, text) {
    this.#message({ level, text })
  }

  debug(text) {
    this.#message({ level: LoggerLevel.DEBUG, text })
  }

  info(text) {
    this.#message({ level: LoggerLevel.INFO, text })
  }

  warn(text) {
    this.#message({ level: LoggerLevel.WARN, text })
  }

  error(text){
    this.#message({ level: LoggerLevel.ERROR, text })
  }
}

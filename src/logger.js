import { LoggerLevel } from './const.js'

export class Logger {
  disabled = false
  namespace = []

  constructor(options = {}) {
    this.directions = options.directions || []
    this.namespace = [options.namespace]
      .filter(Boolean)
      .flat(3)
  }

  #message({ level, text }) {
    if (this.disabled) {
      return
    }

    this.directions.forEach((direction) => {
      direction.act({
        level,
        text,
        namespace: this.namespace,
      })
    })
  }

  ns(value) {
    return new Logger({
      directions: this.directions,
      namespace: this.namespace.concat(value),
    })
  }


  log(level, ...args) {
    this.#message({ level, text: args })
  }

  debug(...args) {
    this.#message({ level: LoggerLevel.DEBUG, text: args })
  }

  info(...args) {
    this.#message({ level: LoggerLevel.INFO, text: args })
  }

  warn(...args) {
    this.#message({ level: LoggerLevel.WARN, text: args })
  }

  error(...args){
    this.#message({ level: LoggerLevel.ERROR, text: args })
  }
}

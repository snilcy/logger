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

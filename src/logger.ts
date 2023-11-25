import {
  isArray,
  shallowMerge,
} from '@snilcy/cake'
import { LoggerLevel } from './const.js'
import type { ILoggerDirection } from './directions/types.js'
import { ILoggerMessage } from './types.js'
import { ConsoleDirection } from './directions/index.js'

const LoggerDirections = { console: ConsoleDirection }

type LoggerDirectionsType = typeof LoggerDirections

type ILoggerDirectionsArgs = {
  [Property in keyof LoggerDirectionsType]?: ConstructorParameters<
    LoggerDirectionsType[Property]
  >[0]
}

type ILoggerDirectionsInstance = {
  [Property in keyof LoggerDirectionsType]?: InstanceType<
    LoggerDirectionsType[Property]
  >
}

type INamespaceParam = string | string[]

export class Logger {
  private disabled = false

  private namespace     : string[] = []
  private directions    : ILoggerDirectionsInstance = {}
  private directionsArgs: ILoggerDirectionsArgs = {}

  constructor(
    namespace: INamespaceParam,
    directionsArgs: ILoggerDirectionsArgs,
  ) {
    this.namespace = isArray(namespace) ? namespace : [namespace]
    this.directionsArgs = directionsArgs

    for (const key in directionsArgs) {
      const directionName = key as keyof LoggerDirectionsType
      const args = directionsArgs[directionName]

      if (args) {
        this.directions[directionName] = new LoggerDirections[directionName](
          args,
        )
      }
    }
  }

  private message(
    level: ILoggerMessage['level'],
    data: ILoggerMessage['data'],
  ) {
    if (this.disabled) {
      return
    }

    Object.values(this.directions).forEach((direction: ILoggerDirection) => {
      direction.act({
        level,
        data,
        namespace: this.namespace,
      })
    })
  }

  ns(namespace: INamespaceParam, directionsArgs: ILoggerDirectionsArgs = {}) {
    return new Logger(
      this.namespace.concat(namespace),
      shallowMerge(this.directionsArgs, directionsArgs),
    )
  }

  log(level: LoggerLevel, ...args: ILoggerMessage['data']) {
    this.message(level, args)
  }

  debug(...args: ILoggerMessage['data']) {
    this.message(LoggerLevel.DEBUG, args)
  }

  info(...args: ILoggerMessage['data']) {
    this.message(LoggerLevel.INFO, args)
  }

  warn(...args: ILoggerMessage['data']) {
    this.message(LoggerLevel.WARN, args)
  }

  error(...args: ILoggerMessage['data']) {
    this.message(LoggerLevel.ERROR, args)
  }
}

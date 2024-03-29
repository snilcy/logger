import { deepMerge, isArray, shallowMerge, toArray } from '@snilcy/cake'
import callsites from 'callsites'

import { LoggerLevel } from './const.js'
import { ConsoleDirection } from './directions/index.js'
import { ILoggerMessage } from './types.js'

import type { ILoggerDirection } from './directions/types.js'

const LoggerDirections = { console: ConsoleDirection }

type ILoggerDirectionsType = typeof LoggerDirections

interface ILoggerParameters {
  filterNS?: string[]
  global?: boolean
}

type ILoggerDirectionsArguments = {
  [Property in keyof ILoggerDirectionsType]?: ConstructorParameters<
    ILoggerDirectionsType[Property]
  >[0]
}

type ILoggerDirectionsInstance = {
  [Property in keyof ILoggerDirectionsType]?: InstanceType<
    ILoggerDirectionsType[Property]
  >
}

type INamespaceParameter = string | string[]

export class Logger {
  private directions: ILoggerDirectionsInstance = {}
  private directionsArguments: ILoggerDirectionsArguments = {}
  private disabled = false
  private namespace: string[] = []
  private parametrs: ILoggerParameters = {
    filterNS: [],
    global: false,
  }

  constructor(
    namespace: INamespaceParameter,
    directionsArguments: ILoggerDirectionsArguments,
    parameters: ILoggerParameters = {},
  ) {
    this.namespace = toArray(namespace).filter(Boolean)
    this.directionsArguments = directionsArguments
    this.parametrs = shallowMerge(this.parametrs, parameters)

    // console.log('Logger.constructor', {
    //   directionsArguments: this.directionsArguments,
    //   namespace: this.namespace,
    //   parameters: this.parametrs,
    // })

    for (const key in directionsArguments) {
      const directionName = key as keyof ILoggerDirectionsType
      const args = directionsArguments[directionName]

      if (args && LoggerDirections[directionName]) {
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
    if (
      this.disabled ||
      this.parametrs.filterNS?.includes(this.namespace.join('.'))
    ) {
      return
    }

    const callsitesList = callsites()

    const functionName = callsitesList.map((callsite) =>
      callsite.getFunctionName(),
    )[2]

    const fileName = callsitesList.map((callsite) => callsite.getFileName())[2]

    const globalNamespace = this.parametrs.global
      ? ([
          fileName && fileName.slice(process.cwd().length + 1),
          functionName,
        ].filter(Boolean) as string[])
      : []

    for (const direction of Object.values(this.directions)) {
      direction.act({
        data,
        level,
        namespace: [...globalNamespace, ...this.namespace],
      })
    }
  }

  debug(...args: ILoggerMessage['data']) {
    this.message(LoggerLevel.DEBUG, args)
  }

  error(...args: ILoggerMessage['data']) {
    this.message(LoggerLevel.ERROR, args)
  }

  info(...args: ILoggerMessage['data']) {
    this.message(LoggerLevel.INFO, args)
  }

  log(level: LoggerLevel, ...args: ILoggerMessage['data']) {
    this.message(level, args)
  }

  ns(
    namespace: INamespaceParameter,
    directionsArguments: ILoggerDirectionsArguments = {},
  ) {
    // console.log('Logger.ns', { namespace })

    const ns: string[] = [...this.namespace, ...toArray(namespace)]
    const options: ILoggerDirectionsArguments = {
      ...this.directionsArguments,
      ...directionsArguments,
      console: shallowMerge(
        this.directionsArguments.console || {},
        directionsArguments.console || {},
      ),
    }

    return new Logger(ns, options, this.parametrs)
  }

  warn(...args: ILoggerMessage['data']) {
    this.message(LoggerLevel.WARN, args)
  }
}

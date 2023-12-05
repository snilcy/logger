/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable unicorn/prevent-abbreviations */

import { Logger } from '../src/index.ts'

const logger = new Logger('Root', {
  console: {
    // format: (a) => a,
    // prefix: '',
    // indent: 20,
    // color: false,
    // oneline: true,
    deep: 5,
    // align: false,
    // excludeKeys: ['arr'],
    length: false,
    // undefined: false,
    lineTerminators: false,
    // only: ['telegram.options.match'],
  },
})

// const error = new Error('error message')

// class SomeError extends Error {
//   second = 1237
//   on() {
//     console.log()
//   }
// }

// const someError = new SomeError('Some error message')
const lgr = new Logger('Test', {
  console: {},
})

const data = {
  array: [1, 2, 3],
  context: {},
  emptyArr: [],
  options: {
    handlerTimeout: 90_000,
    telegram: {},
  },
  telegram: {
    options: {
      agent: {
        _events: {},
        _eventsCount: 2,
        _sessionCache: {
          list: [],
          map: {},
        },
        defaultPort: undefined,
        freeSockets: {},
        keepAlive: true,
        keepAliveMsecs: 10_000,
        maxCachedSessions: 100,
        maxFreeSockets: 256,
        maxSockets: null,
        maxTotalSockets: null,
        options: {
          keepAlive: true,
          keepAliveMsecs: 10_000,
          noDelay: true,
          path: null,
        },
        protocol: 'https:',
        requests: {},
        scheduling: 'lifo',
        sockets: {},
        totalSocketCount: 0,
      },
      apiMode: 'bot',
      apiRoot: 'https://api.telegram.org',
      arr: [1, 3, 7],
      cls: Logger,
      console: 'consoleDirection',
      // error,
      fn: () => {},
      func: console.clear,
      lgr,
      match: ' '.match(/\s/),
      // someError,
      testEnv: false,
      undf: undefined,
      webhookReply: true,
    },
    token: '5985340756:AAHs2uixjfZIZyK8GiVBYo-dHdxpLWV5amc',
  },
}

// const data = {
//   error,
//   someError,
// }

// const data = '<div class="activity-item__image activity-item__image--courses">   \r\n<img src="https://assets.htmlacademy.ru/img/study/keks_courses.v3.svg" width="82" height="101" alt="Тренажёры"></div>'

// const data = [
//   1,
//   {},
//   {
//     one: 'name',
//     arr: [ 1, 4 ],
//   },
//   4,
// ]

// console.log((ConsoleDirection).name)
// console.log(Object.getPrototypeOf(ConsoleDirection).name)
// console.log(() => {})

// // console.log((data))
// console.log(ConsoleDirection.stringify(() => {}))
// logger.debug(137, 'meow', data)

// logger.debug('debug', { name:'JR' })
// logger.info('info')
// logger.warn('warn')
// logger.error('error')

const r = logger.ns('🚀')
// r.disabled = true

// r.debug('debug')
// r.info('info')
// r.warn('warn')
// r.error('error')

const dataObj = {
  inner: {
    this: {},
  },
  name: 'JR',
}

dataObj.inner.this.dataObj = dataObj

const c = r.ns('🐱', {
  // exclude: [
  //   'telegram.options.agent',
  //   'options',
  // ],
  // only: [
  //   'telegram.options.arr',
  // ],
})
// c.info('meow')
c.debug(dataObj)
// console.log(data.telegram.options.console)

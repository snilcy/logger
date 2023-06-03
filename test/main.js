import { Logger } from '../build/index.js'
console.clear()

const logger = new Logger('Root', {
  console: {
    // format: (a) => a,
    // prefix: '',
    // indent: 20,
    // color: false,
    // oneline: true,
    deep: 4,
    // align: false,
    // undefined: false,
    lineTerminators: false,
    excludeKeys: ['arr'],
  },
})

const error = new Error('error message')
class SomeError extends Error {
  second = 1237
  on() {
    console.log()
  }
}
const someError = new SomeError('Some error message')
const lgr = new Logger()

// const data = { 'context':{},'options':{ 'telegram':{},'handlerTimeout':90000 },'telegram':{ 'token':'5985340756:AAHs2uixjfZIZyK8GiVBYo-dHdxpLWV5amc','options':{ 'apiRoot':'https://api.telegram.org','apiMode':'bot','webhookReply':true,'agent':{ '_events':{},'_eventsCount':2,'defaultPort':undefined,'protocol':'https:','options':{ 'keepAlive':true,'keepAliveMsecs':10000,'noDelay':true,'path':null },'requests':{},'sockets':{},'freeSockets':{},'keepAliveMsecs':10000,'keepAlive':true,'maxSockets':null,'maxFreeSockets':256,'scheduling':'lifo','maxTotalSockets':null,'totalSocketCount':0,'maxCachedSessions':100,'_sessionCache':{ 'map':{},'list':[] }},'testEnv':false, 'fn': () => {}, 'func': console.clear, 'cls': Logger, 'console': consoleDirection, error, someError, lgr, undf: undefined, arr: [ 1 ,3 ,7 ],
// }}}

// const data = {
//   error,
//   someError,
// }

// const data = '<div class="activity-item__image activity-item__image--courses">   \r\n<img src="https://assets.htmlacademy.ru/img/study/keks_courses.v3.svg" width="82" height="101" alt="Тренажёры"></div>'

const data = [
  1,
  {
    one: 'name',
    arr: [ 1, 4 ],
  },
  4,
]

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
c.debug(data)
// console.log(data.telegram.options.console)

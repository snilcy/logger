import { Logger, ConsoleDirection } from '../src/index.js'
console.clear()

const logger = new Logger({
  directions: [
    new ConsoleDirection({
      // format: (a) => a,
      // prefix: '',
      // indent: 5
      // color: true
    }),
  ],
})

logger.debug('debug')
logger.info('info')
logger.warn('warn')
logger.error('error')


const r = logger.ns('🚀')
// r.disabled = true

r.debug('debug')
r.info('info')
r.warn('warn')
r.error('error')

const c = r.ns('🐱')
c.info('meow')

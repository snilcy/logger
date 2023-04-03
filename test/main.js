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

logger.debug('debug',
  { 'context':{},'options':{ 'telegram':{},'handlerTimeout':90000 },'telegram':{ 'token':'5985340756:AAHs2uixjfZIZyK8GiVBYo-dHdxpLWV5amc','options':{ 'apiRoot':'https://api.telegram.org','apiMode':'bot','webhookReply':true,'agent':{ '_events':{},'_eventsCount':2,'defaultPort':443,'protocol':'https:','options':{ 'keepAlive':true,'keepAliveMsecs':10000,'noDelay':true,'path':null },'requests':{},'sockets':{},'freeSockets':{},'keepAliveMsecs':10000,'keepAlive':true,'maxSockets':null,'maxFreeSockets':256,'scheduling':'lifo','maxTotalSockets':null,'totalSocketCount':0,'maxCachedSessions':100,'_sessionCache':{ 'map':{},'list':[] }},'testEnv':false }}})

logger.debug('debug', { name: 'JR' })
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

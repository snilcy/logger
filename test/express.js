console.clear()

import express from 'express'

import { express as loggerExpress } from '../src/index.js'

const app = express()
app.use(loggerExpress(['🚀']))
app.listen(3000, async () => {
  fetch('http://localhost:3000')
  fetch('http://localhost:3000/meow')
  fetch('http://localhost:3000/one?thow=three')
})

const bugsnag = require('@bugsnag/js')
const express = require('express')
const { readFileSync } = require('fs')

const bugsnagClient = bugsnag(process.env.BUGSNAG_API_KEY)
bugsnagClient.use(require('@bugsnag/plugin-express'))

const app = express()
const { requestHandler, errorHandler } = bugsnagClient.getPlugin('express')

app.use(requestHandler)

app.use('/static', express.static(`${__dirname}/static`))

const index = readFileSync('./views/index.html', 'utf8')
app.get('/', (req, res) => {
  res.send(index)
})

app.post('/crash', (req, res) => {
  setTimeout(() => { throw new Error('Uh oh') })
})

app.post('/handled', (req, res) => {
  throw new Error('Just a wobble')
})

app.post('/add-info', (req, res, next) => {
  req.bugsnag.user = { id: '123', name: 'jim' }
  next(new Error('Cannot load Jim’s items'))
})

app.use(errorHandler)

app.listen(9871)

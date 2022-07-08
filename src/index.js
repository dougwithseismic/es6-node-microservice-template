import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import 'babel-polyfill'
import helmet from 'helmet'
import xss from 'xss-clean'
import compression from 'compression'

import bodyParser from 'body-parser'
import routes from '@routes/v1'

/*
    * Initialize Express App


*/

process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION', error) // TODO: Check if it's a baaaad one and shut down
})

let port = process.env.PORT || 3000

const app = express()
app.use(helmet())

app.use(cors())
app.options('*', cors())

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

// sanitize request data
app.use(xss())

// gzip compression
app.use(compression())

// limit repeated failed requests to auth endpoints
if (process.env.NODE_ENV === 'production') {
  app.use('/v1/auth', authLimiter)
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/v1', routes)

app.listen(port, () => {
  console.log('PROJECT_NAME :: Server Live on port', port)
})

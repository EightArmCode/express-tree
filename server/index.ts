import bodyParser from 'body-parser'
import express from 'express'
import morganMiddleware from './logging/morganMiddleware.ts'
import cors from 'cors'
import { main } from '../prisma/index.ts'
import Logger from './logging/winstonLogger.ts'
export const env = process.env.NODE_ENV || 'development'
const isProd = env === 'production'

const port = process.env.PORT || 3000
const app = express()
const domain = isProd ? 'https://express-tree.onrender.com' : 'http://localhost'

app.use(cors({
  origin: domain,
}))
app.use(express.json())
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morganMiddleware)

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.get('/logs', (req, res) => {
  Logger.error('This is an error log')
  Logger.warn('This is a warn log')
  Logger.info('This is a info log')
  Logger.http('This is a http log')
  Logger.debug('This is a debug log')

  res.send('Hello world')
})

app.get('/tree', async(req, res) => {
  let tree = null
  try {
    tree = await main()
    res.status(200).json(tree)
  } catch (e) {
    res.status(500).json({ error: 'An error occurred' })
  }
  return tree
})

app.get('/', (req, res) => {
  res.status(200).sendFile('public/index.html')
})

app.listen(port, () => {
  console.log(`🚀 Server ready at: ${domain}:${port}`)
})

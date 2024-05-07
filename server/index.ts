import bodyParser from 'body-parser'
import express from 'express'
import morganMiddleware from './logging/morganMiddleware.ts'
import cors from 'cors'
import { main } from '../prisma/index.ts'
import Logger from './logging/winstonLogger.ts'
import helmet from 'helmet'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import cspConfig from './csp.ts'

export const env = process.env.NODE_ENV || 'development'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const isProd = env === 'production'
const port = process.env.PORT || 3000
const cspMiddleware = helmet({
  contentSecurityPolicy: cspConfig.contentSecurityPolicy,
})
const domain = isProd
  ? 'https://express-tree.onrender.com' // Render sets the PORT environment variable for you
  : `http://localhost:${port}`

app.set('view engine', 'pug')
app.set('views', './views')

app.use(cors({
  origin: domain,
}))

app.use((_req, res, next) => {
  // Asynchronously generate a unique nonce for each request.
  crypto.randomBytes(32, (err, randomBytes) => {
    if (err) {
      // If there was a problem, bail.
      next(err)
    } else {
      // Save the nonce, as a hex string, to `res.locals` for later.
      res.locals.cspNonce = randomBytes.toString('hex')
      next()
    }
  })
})

app.use(cspMiddleware)
app.use(express.static(join(__dirname, '../public')))
app.use(express.json())
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
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

app.get('/', (_req, res) => {
  res.render('index', { cspNonce: res.locals.cspNonce, domain })
})

app.listen(port, () => {
  console.log(`🚀 Express-Tree Server is ALIVE 😱 and running in ${env.toUpperCase()} mode at: \r${domain} 🚀`)
})

export { app }

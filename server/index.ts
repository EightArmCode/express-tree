import bodyParser from 'body-parser'
import express, { Response } from 'express'
import morganMiddleware from './logging/morganMiddleware.ts'
import cors from 'cors'
import { main } from '../prisma/index.ts'
import Logger from './logging/winstonLogger.ts'
import helmet from 'helmet'
import crypto from 'node:crypto'
import { IncomingMessage, ServerResponse } from 'node:http'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

export const env = process.env.NODE_ENV || 'development'
const isProd = env === 'production'
const port = process.env.PORT || 3000
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const domain = isProd ? 'https://express-tree.onrender.com' : 'http://localhost'

app.set('view engine', 'pug')
app.set('views', './views')

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
app.use(cors({
  origin: domain,
}))
const cspConfig = {
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': ['\'self\''],
      'script-src': [
        '\'self\'',
        'https://unpkg.com/vue@3.4.26/dist/vue.esm-browser.js',
        'https://cdn.jsdelivr.net/npm/d3-hierarchy@3.1.2/+esm',
        'https://cdn.jsdelivr.net/npm/d3-scale@4.0.2/+esm',
        'https://cdn.jsdelivr.net/npm/d3-shape@3.2.0/+esm',
        'https://unpkg.com/axios@1.6.8/dist/esm/axios.min.js',
        'https://cdn.jsdelivr.net/npm/d3-path@3.1.0/+esm',
        // Include this nonce in the `script-src` directive.
        (_req: unknown, res: ServerResponse<IncomingMessage>) => `'nonce-${(res as Response).locals.cspNonce}'`,
        '\'unsafe-inline\'',
        '\'unsafe-eval\'', // Disocvered after writing the app using Vue 3 without a build step that it is not compliant with CSP. Do not use this in production. The alternative is to use the render function, but the syntax is not easy to read (and it is syntactically drastically different from vue templates).
      ],
      'style-src': [
        '\'self\'',
        'https://fonts.googleapis.com',
        (_req: unknown, res: ServerResponse<IncomingMessage>) => `'nonce-${(res as Response).locals.cspNonce}'`,
        '\'unsafe-inline\'',
      ],
      'object-src': ['\'none\''],
      'connect-src': ['\'self\''],
    },
  },
}
const cspMiddleware = helmet({
  contentSecurityPolicy: cspConfig.contentSecurityPolicy,
})
app.use(
  cspMiddleware,
)
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
  res.render('index', { cspNonce: res.locals.cspNonce, domain: `${domain}:${port}` })
})

app.listen(port, () => {
  console.log(`🚀 Express-Tree Server is ALIVE 😱 and running in ${env.toUpperCase()} mode at: ${domain}:${port} 🚀`)
})

export { app }

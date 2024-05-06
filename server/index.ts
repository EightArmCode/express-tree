import bodyParser from 'body-parser'
import express from 'express'
import logger from 'morgan'

import { main } from '../prisma/index.ts'

const port = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(logger('dev'))

app.get('/tree', async(req, res) => {
  let tree = null
  try {
    tree = await main()
    res.status(200).json(tree)
  } catch (e) {
    console.error('logger', e)
    res.status(500).json({ error: 'An error occurred' })
  }
  return tree
})

app.get('/', (req, res) => {
  res.status(200).sendFile('public/index.html')
})

app.listen(port, () => {
  console.log(`🚀 Server ready at: https://express-tree.onrender.com/:${port}`)
})

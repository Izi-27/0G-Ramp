require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const app = express()

app.use(helmet())
// CORS: allow local dev by default and optionally additional origins via CORS_ORIGINS env (comma-separated)
const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174']
const extraOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
  .map(url => url.replace(/\/$/, ''))
const allowedOrigins = [...defaultOrigins, ...extraOrigins]

app.use(cors({
  origin: (origin, cb) => {
    // Allow non-browser requests or same-origin
    if (!origin) return cb(null, true)
    const normalized = origin.replace(/\/$/, '')
    const ok = allowedOrigins.includes(normalized)
    cb(null, ok)
  },
  credentials: true,
}))
app.use(morgan('dev'))
// Capture raw JSON body for webhook HMAC verification
app.use(express.json({
  verify: (req, res, buf) => {
    try {
      req.rawBody = buf.toString()
    } catch {}
  }
}))

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 })
app.use(limiter)

app.get('/health', (req, res) => res.json({ ok: true }))

app.use('/api/onramp', require('./routes/onramp'))
app.use('/api/offramp', require('./routes/offramp'))
app.use('/api/webhook', require('./routes/webhook'))
app.use('/api/transactions', require('./routes/transactions'))
app.use('/api/dev', require('./routes/dev'))
app.use('/api/kyc', require('./routes/kyc'))

app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ error: 'Internal Server Error' })
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Velora backend listening on http://localhost:${port}`)
})
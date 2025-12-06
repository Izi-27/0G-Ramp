const prisma = require('../db')
const paymentService = require('../services/paymentService')
const walletService = require('../services/walletService')
const storageService = require('../services/ogStorageService')
const offrampService = require('../services/offrampService')

exports.paymentCallback = async (req, res, next) => {
  try {
    const signature = req.headers['x-provider-signature']
    const { sessionId, status } = req.body || {}
    const ok = paymentService.verifySignature(req.body, signature)
    if (!ok) return res.status(401).json({ error: 'invalid signature' })

    const session = await prisma.session.findUnique({ where: { id: Number(sessionId) }, include: { user: true } })
    if (!session) return res.status(404).json({ error: 'session not found' })

    if (status === 'success') {
      // Simulate stablecoin transfer and receipt logging
      const amountUSDC = session.fiatAmount // 1:1 demo
      const txHash = await walletService.transferStablecoin(session.user.wallet, amountUSDC)
      const receipt = { sessionId, wallet: session.user.wallet, amountUSDC, txHash, ts: Date.now() }
      const storageCid = await storageService.storeReceipt(receipt)
      await prisma.transaction.create({
        data: {
          sessionId: session.id,
          txHash,
          storageCid,
          amount: amountUSDC,
          status: 'success',
          type: session.type,
          wallet: session.user.wallet,
        },
      })
      await prisma.session.update({ where: { id: session.id }, data: { status: 'completed' } })
    } else {
      await prisma.session.update({ where: { id: session.id }, data: { status: 'failed' } })
    }

    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

// Off-ramp provider webhook (payout status)
exports.offrampCallback = async (req, res, next) => {
  try {
    const provider = String(process.env.OFFRAMP_PROVIDER || 'mock').toLowerCase()
    const signature = req.headers['x-provider-signature']
      || req.headers['x-transak-signature']
      || req.headers['x-signature']
    // Prefer raw body for HMAC verification if available
    const payload = req.rawBody ? req.rawBody : (req.body || {})
    const ok = offrampService.verifyWebhookSignature(payload, signature)
    if (!ok) return res.status(401).json({ error: 'invalid signature' })

    // Expect payload to include our internal sessionId or providerSessionId
    const where = payload.sessionId
      ? { id: Number(payload.sessionId) }
      : { providerSessionId: String(payload.providerSessionId || '') }

    const session = await prisma.session.findFirst({ where, include: { user: true } })
    if (!session) return res.status(404).json({ error: 'session not found' })

    const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload
    const status = String(parsed.status || '').toLowerCase()

    if (status === 'success' || status === 'completed') {
      const payoutId = parsed.payoutId || parsed.txId || parsed.orderId || null
      const amountFiat = Number(parsed.fiatAmount || session.fiatAmount)
      const storageCid = await storageService.storeReceipt({
        kind: 'offramp', sessionId: session.id, wallet: session.user.wallet, payoutId, amountFiat, ts: Date.now()
      })
      await prisma.transaction.create({
        data: {
          sessionId: session.id,
          txHash: payoutId,
          storageCid,
          amount: amountFiat,
          status: 'success',
          type: 'offramp',
          wallet: session.user.wallet,
        },
      })
      await prisma.session.update({ where: { id: session.id }, data: { status: 'completed' } })
    } else {
      await prisma.session.update({ where: { id: session.id }, data: { status: 'failed' } })
    }

    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}
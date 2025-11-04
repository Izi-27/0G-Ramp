const prisma = require('../db')
const offrampService = require('../services/offrampService')

exports.requestPayout = async (req, res, next) => {
  try {
    const { walletAddress, amount, payoutMethod, currency = 'USD', country = 'US' } = req.body || {}
    if (!walletAddress || !amount || !payoutMethod) {
      return res.status(400).json({ error: 'walletAddress, amount, payoutMethod required' })
    }
    const wallet = walletAddress.toLowerCase()
    let user = await prisma.user.findUnique({ where: { wallet } })
    if (!user) {
      user = await prisma.user.create({ data: { wallet } })
    }

    // Create provider payout session (returns checkout url and optional deposit details)
    const providerIntent = await offrampService.createPayoutSession({ wallet, amount, currency, country, payoutMethod })

    // Persist as a session; additional fields will be added via migration
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        type: 'offramp',
        fiatAmount: Number(amount),
        token: providerIntent.memo,
        status: 'pending',
      },
    })

    // Best-effort update extra fields when available in schema
    try {
      await prisma.session.update({
        where: { id: session.id },
        data: {
          provider: providerIntent.provider,
          providerSessionId: providerIntent.providerSessionId,
          checkoutUrl: providerIntent.checkoutUrl,
          currency,
          country,
          payoutMethod,
          depositAddress: providerIntent.depositAddress,
        },
      })
    } catch (e) {
      // ignore if migration not applied yet
    }

    res.json({ sessionId: session.id, depositRef: providerIntent.memo, checkoutUrl: providerIntent.checkoutUrl })
  } catch (err) {
    next(err)
  }
}
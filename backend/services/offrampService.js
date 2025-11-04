const axios = require('axios')
const crypto = require('crypto')

function env(name, fallback = undefined) {
  return process.env[name] ?? fallback
}

function providerName() {
  return (env('OFFRAMP_PROVIDER', 'mock') || 'mock').toLowerCase()
}

async function createPayoutSession({ wallet, amount, currency = 'USD', country = 'US', payoutMethod = 'bank' }) {
  const provider = providerName()

  if (provider === 'mock') {
    const clientToken = crypto.randomBytes(16).toString('hex')
    const checkoutUrl = `https://checkout.example.com/off/${clientToken}`
    return {
      provider: 'mock',
      providerSessionId: clientToken,
      checkoutUrl,
      depositAddress: env('RAMP_VAULT_ADDRESS') || null,
      memo: `OFF-${Date.now()}`,
    }
  }

  if (provider === 'transak') {
    // Transak fiat off-ramp order creation (hardened)
    const apiKey = env('OFFRAMP_API_KEY')
    const baseUrl = env('OFFRAMP_BASE_URL', 'https://api.transak.com')
    const token = env('OFFRAMP_TOKEN', 'USDC')
    const network = env('OFFRAMP_NETWORK', 'ethereum')
    if (!apiKey) throw new Error('OFFRAMP_API_KEY required for Transak')

    try {
      const res = await axios.post(
        baseUrl.replace(/\/$/, '') + '/api/v1/orders/create',
        {
          cryptoCurrency: token,
          network,
          sellAmount: Number(amount),
          payoutMethod,
          paymentCurrency: currency,
          userWalletAddress: wallet,
          countryCode: country,
        },
        {
          headers: { 'apiKey': apiKey, 'Content-Type': 'application/json' },
          timeout: 20000,
        }
      )
      const data = res.data || {}
      return {
        provider: 'transak',
        providerSessionId: data?.orderId || data?.id,
        checkoutUrl: data?.paymentLink || data?.widgetUrl || data?.redirectUrl,
        depositAddress: data?.cryptoDepositAddress || data?.depositAddress || null,
        memo: data?.memo || `OFF-${Date.now()}`,
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message
      console.error('[Transak] create order failed:', msg)
      throw new Error('Transak order creation failed')
    }
  }

  if (provider === 'lifi') {
    // Example: LI.FI Off-Ramp aggregator (pseudo-code)
    const apiKey = env('OFFRAMP_API_KEY')
    const baseUrl = env('OFFRAMP_BASE_URL', 'https://api.li.fi')
    if (!apiKey) throw new Error('OFFRAMP_API_KEY required for LI.FI')

    const res = await axios.post(
      baseUrl.replace(/\/$/, '') + '/offramp/orders',
      {
        fromChain: env('OFFRAMP_CHAIN', 'ethereum'),
        fromToken: env('OFFRAMP_TOKEN', 'USDC'),
        amount: String(amount),
        payoutMethod,
        currency,
        wallet,
        country,
      },
      {
        headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
        timeout: 20000,
      }
    )
    const data = res.data || {}
    return {
      provider: 'lifi',
      providerSessionId: data?.id,
      checkoutUrl: data?.checkoutUrl || data?.widgetUrl,
      depositAddress: data?.depositAddress || null,
      memo: data?.memo || `OFF-${Date.now()}`,
    }
  }

  throw new Error(`Unsupported OFFRAMP_PROVIDER: ${provider}`)
}

function verifyWebhookSignature(payload, signature) {
  const provider = providerName()

  if (provider === 'mock') {
    return signature === 'dev'
  }

  if (provider === 'transak') {
    // HMAC verification with provider secret over raw request body
    const secret = env('OFFRAMP_SECRET')
    if (!secret || !signature) return false
    const raw = typeof payload === 'string' ? payload : JSON.stringify(payload)
    const computed = crypto.createHmac('sha256', secret).update(raw).digest('hex')
    return computed === signature || computed.toLowerCase() === String(signature).toLowerCase()
  }

  if (provider === 'lifi') {
    const secret = env('OFFRAMP_SECRET')
    if (!secret || !signature) return false
    const raw = typeof payload === 'string' ? payload : JSON.stringify(payload)
    const computed = crypto.createHmac('sha256', secret).update(raw).digest('hex')
    return computed === signature || computed.toLowerCase() === String(signature).toLowerCase()
  }

  return false
}

module.exports = {
  createPayoutSession,
  verifyWebhookSignature,
}
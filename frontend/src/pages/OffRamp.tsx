import { useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { useAccount } from 'wagmi'
import Layout from '../components/Layout'
import { requestOfframp } from '../lib/api'

export default function OffRamp() {
  const { address } = useAccount()
  const [amount, setAmount] = useState('100')
  const [payoutMethod, setPayoutMethod] = useState('bank')
  const [depositRef, setDepositRef] = useState<string | null>(null)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [currency, setCurrency] = useState('USD')
  const [country, setCountry] = useState('US')

  const request = async () => {
    if (!address) return setMessage('Connect wallet first.')
    setLoading(true)
    setMessage(null)
    try {
      const res = await requestOfframp({ 
        walletAddress: address, 
        amount: Number(amount), 
        payoutMethod,
        currency,
        country,
      })
      setDepositRef(res.depositRef)
      setCheckoutUrl(res.checkoutUrl || null)
      setMessage('Off-ramp request created successfully.')
    } catch (e: any) {
      setMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setDepositRef(null)
    setMessage(null)
    setAmount('100')
    setPayoutMethod('bank')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-transparent">
        <div className="max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-12"
          >
            <motion.div 
              className="inline-flex items-center justify-center w-20 md:w-24 h-20 md:h-24 bg-linear-to-br from-purple-400/20 to-pink-600/20 backdrop-blur-xl rounded-3xl mb-4 md:mb-6 relative overflow-hidden border border-purple-400/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
              style={{
                boxShadow: '0 0 40px rgba(168, 85, 247, 0.3)'
              }}
            >
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-purple-400/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <Icon icon="mdi:bank-transfer-out" className="text-4xl md:text-5xl text-purple-400 relative z-10" />
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">
              Off-Ramp Service
            </h1>
            <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Convert your USDC to fiat currency. Secure withdrawals directly to your bank account or mobile wallet.
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Transaction Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-accent/20 p-6 md:p-8 hover:border-accent/30 transition-all duration-300"
                style={{
                  boxShadow: '0 0 30px rgba(255, 79, 216, 0.1)'
                }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <motion.div 
                    className="w-12 h-12 bg-linear-to-br from-purple-400/20 to-pink-600/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-purple-400/30"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon icon="mdi:currency-usd" className="text-2xl text-purple-400" />
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Withdraw USDC
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Amount Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Amount to Withdraw
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-3 bg-black/50 border border-accent/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent/40 transition-colors"
                        placeholder="Enter USDC amount"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className="text-gray-400 text-sm font-medium">
                          USDC
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payout Method Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Payout Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPayoutMethod('bank')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          payoutMethod === 'bank'
                            ? 'border-accent/40 bg-accent/10 backdrop-blur-sm'
                            : 'border-accent/20 bg-black/30 backdrop-blur-sm hover:border-accent/30 hover:bg-black/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              payoutMethod === 'bank'
                                ? 'bg-accent/20 backdrop-blur-sm border border-accent/40'
                                : 'bg-accent/10 backdrop-blur-sm border border-accent/20'
                            }`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Icon 
                              icon="mdi:bank" 
                              className={`text-xl ${
                                payoutMethod === 'bank'
                                  ? 'text-accent'
                                  : 'text-gray-300'
                              }`}
                            />
                          </motion.div>
                          <div className="text-left">
                            <h3 className="font-medium text-white">
                              Bank Transfer
                            </h3>
                            <p className="text-sm text-gray-400">
                              Direct to bank account
                            </p>
                          </div>
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPayoutMethod('mobile')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          payoutMethod === 'mobile'
                            ? 'border-purple-400/40 bg-purple-400/10 backdrop-blur-sm'
                            : 'border-accent/20 bg-black/30 backdrop-blur-sm hover:border-accent/30 hover:bg-black/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              payoutMethod === 'mobile'
                                ? 'bg-purple-400/20 backdrop-blur-sm border border-purple-400/40'
                                : 'bg-accent/10 backdrop-blur-sm border border-accent/20'
                            }`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Icon 
                              icon="mdi:cellphone" 
                              className={`text-xl ${
                                payoutMethod === 'mobile'
                                  ? 'text-purple-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </motion.div>
                          <div className="text-left">
                            <h3 className="font-medium text-white">
                              Mobile Money
                            </h3>
                            <p className="text-sm text-gray-400">
                              Mobile wallet transfer
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    </div>
                  </div>

                  {/* Conversion Preview */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-accent/10">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">You send:</span>
                      <span className="font-medium text-white">
                        {amount} USDC
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">You receive:</span>
                      <span className="font-medium text-white">
                        ≈ ${amount} USD
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-accent/10">
                      <span className="text-gray-500">Processing fee:</span>
                      <span className="text-gray-500">0.5%</span>
                    </div>
                  </div>

                  {/* Currency Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Currency
                    </label>
                    <select
                      title='currency'
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-accent/20 rounded-xl text-white focus:outline-none focus:border-accent/40 transition-colors"
                    >
                      <option value="USD">🇺🇸 US Dollar (USD)</option>
                      <option value="EUR">🇪🇺 Euro (EUR)</option>
                      <option value="GBP">🇬🇧 British Pound (GBP)</option>
                    </select>
                  </div>

                  {/* Country Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Country
                    </label>
                    <select
                      title='country'
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-accent/20 rounded-xl text-white focus:outline-none focus:border-accent/40 transition-colors"
                    >
                      <option value="US">🇺🇸 United States</option>
                      <option value="GB">🇬🇧 United Kingdom</option>
                      <option value="EU">🇪🇺 European Union</option>
                      <option value="IN">🇮🇳 India</option>
                      <option value="BR">🇧🇷 Brazil</option>
                    </select>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={request}
                    disabled={loading || !address}
                    className="w-full py-4 bg-linear-to-r from-accent to-purple-600 text-white font-semibold rounded-xl hover:from-accent/90 hover:to-purple-600/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-accent/30"
                    style={{
                      boxShadow: '0 0 20px rgba(255, 79, 216, 0.3)'
                    }}
                  >
                    {loading ? (
                      <>
                        <Icon icon="mdi:loading" className="animate-spin" />
                        Creating Request...
                      </>
                    ) : !address ? (
                      <>
                        <Icon icon="mdi:wallet-outline" />
                        Connect Wallet First
                      </>
                    ) : (
                      <>
                        <Icon icon="mdi:send" />
                        Request Withdrawal
                      </>
                    )}
                  </motion.button>

                  {/* Reset Button */}
                  {(depositRef || message) && (
                    <motion.button
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      onClick={resetForm}
                      className="w-full bg-black/30 backdrop-blur-sm hover:bg-black/40 border border-accent/20 text-gray-300 hover:text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Icon icon="mdi:refresh" />
                      Start New Withdrawal
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Status Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Connection Status */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-accent/20 p-6"
                style={{
                  boxShadow: '0 0 20px rgba(255, 79, 216, 0.1)'
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className="w-10 h-10 bg-linear-to-br from-blue-400/20 to-cyan-600/20 backdrop-blur-xl rounded-lg flex items-center justify-center border border-blue-400/30"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon icon="mdi:wallet" className="text-lg text-blue-400" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white">
                    Wallet Status
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Connection:</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${address ? 'bg-green-400' : 'bg-gray-500'}`} />
                      <span className="text-sm font-medium text-white">
                        {address ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                  {address && (
                    <div className="text-xs text-gray-400 font-mono break-all bg-black/30 p-2 rounded-lg">
                      {address}
                    </div>
                  )}
                </div>
              </div>

              {/* Deposit Reference */}
              {depositRef && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-400/30 p-6"
                  style={{
                    boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)'
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div 
                      className="w-10 h-10 bg-linear-to-br from-purple-400/20 to-pink-600/20 backdrop-blur-xl rounded-lg flex items-center justify-center border border-purple-400/30"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon icon="mdi:receipt" className="text-lg text-purple-400" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white">
                      Deposit Reference
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    Use this reference when sending USDC to the vault:
                  </p>
                  <div className="space-y-3">
                    <div className="bg-black/50 rounded-lg p-3 border border-purple-400/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-mono text-white break-all">
                          {depositRef}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => depositRef && navigator.clipboard.writeText(depositRef)}
                          className="ml-2 p-2 rounded-lg bg-purple-400/20 border border-purple-400/30 hover:bg-purple-400/30 text-purple-400 transition-colors"
                        >
                          <Icon icon="mdi:content-copy" className="text-sm" />
                        </motion.button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 bg-purple-400/5 p-3 rounded-lg border border-purple-400/10">
                      <p className="mb-2">
                        <strong className="text-purple-400">Important:</strong> Include this reference in your USDC transfer to ensure proper processing.
                      </p>
                      <p>
                        Send exactly <strong className="text-white">{amount} USDC</strong> to the vault address with this memo.
                      </p>
                    </div>
                    <a href={checkoutUrl!} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-medium transition-colors">
                      <Icon icon="mdi:open-in-new" />
                      Open Provider Checkout
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Checkout URL */}
              {checkoutUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/40 backdrop-blur-xl rounded-2xl border border-green-400/30 p-6"
                  style={{ boxShadow: '0 0 20px rgba(52, 211, 153, 0.2)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div 
                      className="w-10 h-10 bg-linear-to-br from-green-400/20 to-emerald-600/20 backdrop-blur-xl rounded-lg flex items-center justify-center border border-green-400/30"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon icon="mdi:link" className="text-lg text-green-400" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white">
                      Payout Checkout
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    Complete your payout using the provider checkout link:
                  </p>
                  <div className="space-y-3">
                    <div className="bg-black/50 rounded-lg p-3 border border-purple-400/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-mono text-white break-all">
                          {depositRef}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => depositRef && navigator.clipboard.writeText(depositRef)}
                          className="ml-2 p-2 rounded-lg bg-purple-400/20 border border-purple-400/30 hover:bg-purple-400/30 text-purple-400 transition-colors"
                        >
                          <Icon icon="mdi:content-copy" className="text-sm" />
                        </motion.button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 bg-purple-400/5 p-3 rounded-lg border border-purple-400/10">
                      <p className="mb-2">
                        <strong className="text-purple-400">Important:</strong> Include this reference in your USDC transfer to ensure proper processing.
                      </p>
                      <p>
                        Send exactly <strong className="text-white">{amount} USDC</strong> to the vault address with this memo.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Status Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl border p-6 ${
                    message.includes('created') || message.includes('success')
                      ? 'bg-green-400/10 border-green-400/30'
                      : message.includes('Error') || message.includes('Connect')
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-blue-400/10 border-blue-400/30'
                  }`}
                  style={{
                    boxShadow: message.includes('created') || message.includes('success')
                      ? '0 0 20px rgba(52, 211, 153, 0.2)'
                      : message.includes('Error') || message.includes('Connect')
                      ? '0 0 20px rgba(239, 68, 68, 0.2)'
                      : '0 0 20px rgba(96, 165, 250, 0.2)'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      icon={
                        message.includes('created') || message.includes('success')
                          ? "mdi:check-circle"
                          : message.includes('Error') || message.includes('Connect')
                          ? "mdi:alert-circle"
                          : "mdi:information"
                      }
                      className={`text-xl mt-0.5 ${
                        message.includes('created') || message.includes('success')
                          ? 'text-green-400'
                          : message.includes('Error') || message.includes('Connect')
                          ? 'text-red-500'
                          : 'text-blue-400'
                      }`}
                    />
                    <div>
                      <h4 className={`font-medium mb-1 ${
                        message.includes('created') || message.includes('success')
                          ? 'text-green-300'
                          : message.includes('Error') || message.includes('Connect')
                          ? 'text-red-400'
                          : 'text-blue-300'
                      }`}>
                        {message.includes('created') ? 'Request Created' : 
                        message.includes('Error') || message.includes('Connect') ? 'Action Required' : 'Information'}
                      </h4>
                      <p className={`text-sm ${
                        message.includes('created') || message.includes('success')
                          ? 'text-green-400/80'
                          : message.includes('Error') || message.includes('Connect')
                          ? 'text-red-400/80'
                          : 'text-blue-400/80'
                      }`}>
                        {message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Information Panel */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-accent/20 p-6"
                style={{
                  boxShadow: '0 0 20px rgba(255, 79, 216, 0.1)'
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className="w-10 h-10 bg-linear-to-br from-accent/20 to-purple-600/20 backdrop-blur-xl rounded-lg flex items-center justify-center border border-accent/30"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon icon="mdi:information" className="text-lg text-accent" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white">
                    How it Works
                  </h3>
                </div>
                <div className="space-y-3 text-sm text-gray-400">
                  {[
                    'Enter the USDC amount you want to withdraw',
                    'Choose your preferred payout method',
                    'Send USDC to the vault with the provided reference',
                    'Receive fiat currency in your chosen account'
                  ].map((step, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 bg-purple-400/20 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-purple-400/30">
                        <span className="text-xs font-bold text-purple-400">{i + 1}</span>
                      </div>
                      <p>{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
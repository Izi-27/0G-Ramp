import { motion, useScroll } from "framer-motion";
import type { Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { FloatingElement } from "../components/ui/FloatingElement";
import { GlowOrb } from "../components/ui/GlowOrb";
import { CursorFollowEffect } from "../components/ui/CursorFollowEffect";
import { AnimatedBackgroundGrid } from "../components/ui/AnimatedBackgroundGrid";
import { ConnectionLines } from "../components/ui/ConnectionLines";
import AnimatedParticles from "../components/ui/AnimatedParticles";

export default function Landing() {
  const { scrollYProgress } = useScroll();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Cursor Follow Effect */}
      <CursorFollowEffect mousePosition={mousePosition} />

      {/* Animated Background Grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <AnimatedBackgroundGrid scrollYProgress={scrollYProgress} />

        {/* Glowing Orbs */}
        <GlowOrb
          className="w-[400px] h-[400px] -top-40 -right-40 opacity-40"
          delay={0}
        />
        <GlowOrb
          className="w-[450px] h-[450px] top-1/2 -left-60 opacity-30"
          delay={1.5}
        />
        <GlowOrb
          className="w-[300px] h-[300px] bottom-20 right-1/4 opacity-30"
          delay={3}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-50 flex items-center justify-between px-6 lg:px-12 py-6 backdrop-blur-md bg-black/30 border-b border-accent/20"
        style={{
          boxShadow: "0 4px 30px rgba(255, 79, 216, 0.1)",
        }}
      >
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className="relative"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Icon
              icon="mdi:bridge"
              className="text-accent text-3xl relative z-10"
            />
            <motion.div
              className="absolute inset-0 text-accent text-3xl opacity-20"
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon icon="mdi:bridge" />
            </motion.div>
          </motion.div>
          <span className="font-bold text-xl bg-linear-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent">
            0G Ramp
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ConnectButton />
        </motion.div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-12">
        {/* 3D Floating Elements - Mobile Optimized */}
        <FloatingElement
          className="top-1/4 left-10"
          delay={0}
          mobileHidden={true}
        />
        <FloatingElement
          className="top-1/3 right-16"
          delay={1}
          size="w-12 h-12"
        />
        <FloatingElement
          className="bottom-1/4 left-1/4"
          delay={2}
          size="w-20 h-20"
          gradient
          mobileHidden={true}
        />
        <FloatingElement
          className="top-1/2 right-1/4"
          delay={1.5}
          size="w-14 h-14"
          mobileHidden={true}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto text-center relative z-10"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <motion.span
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-accent/30 text-white text-sm font-medium shadow-lg"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(255, 79, 216, 0.4)",
              }}
              style={{
                boxShadow: "0 0 20px rgba(255, 79, 216, 0.2)",
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Icon
                  icon="mdi:lightning-bolt"
                  className="text-lg text-accent"
                />
              </motion.div>
              Powered by 0G Network
            </motion.span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-10"
          >
            <motion.span
              className="block bg-linear-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              Seamless
            </motion.span>
            <motion.span
              className="block bg-linear-to-r from-accent via-purple-400 to-accent bg-clip-text text-transparent"
              style={{ backgroundSize: "200%" }}
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Fiat ↔ Crypto
            </motion.span>
            <motion.span
              className="block bg-linear-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              Bridge
            </motion.span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-14 leading-relaxed"
          >
            Experience the future of decentralized finance with our
            professional, secure, and lightning-fast fiat-to-stablecoin bridge
            built on the revolutionary 0G Network infrastructure.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/dashboard"
                className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-2xl bg-linear-to-r from-accent to-purple-600 text-white shadow-2xl overflow-hidden"
                style={{
                  boxShadow: "0 0 40px rgba(255, 79, 216, 0.2)",
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-purple-600 to-accent"
                  initial={{ x: "100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
                <Icon
                  icon="mdi:rocket-launch"
                  className="mr-3 text-xl relative z-10"
                />
                <span className="relative z-10">Start Trading</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/developers"
                className="group inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-2xl bg-black/40 backdrop-blur-xl hover:bg-black/60 text-white border border-accent/30 hover:border-accent/60 transition-all duration-300"
              >
                <Icon
                  icon="mdi:code-tags"
                  className="mr-3 text-xl group-hover:rotate-12 transition-transform text-accent"
                />
                View API Docs
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Animated Particles */}
        <AnimatedParticles />
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6 lg:px-12">
        <FloatingElement
          className="top-10 right-20"
          delay={0.5}
          size="w-24 h-24"
          gradient
          mobileHidden={true}
        />
        <FloatingElement
          className="bottom-20 left-10"
          delay={1.5}
          size="w-16 h-16"
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-20">
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Why Choose 0G Ramp?
            </motion.h2>
            <motion.p
              className="text-xl text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Built for the future of decentralized finance with cutting-edge
              technology and unmatched security.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "mdi:shield-check",
                title: "Bank-Grade Security",
                description:
                  "Multi-layer security protocols with advanced encryption and secure transaction receipts stored on 0G Network.",
              },
              {
                icon: "mdi:lightning-bolt",
                title: "Lightning Fast",
                description:
                  "Process transactions in seconds, not minutes. Built on 0G's high-performance blockchain infrastructure.",
              },
              {
                icon: "mdi:currency-usd",
                title: "Low Fees",
                description:
                  "Competitive rates with transparent pricing. No hidden fees, no surprises. Just fair, honest pricing.",
              },
              {
                icon: "mdi:api",
                title: "Developer Friendly",
                description:
                  "Comprehensive APIs and SDKs for seamless integration. Build the future of finance with our tools.",
              },
              {
                icon: "mdi:earth",
                title: "Global Access",
                description:
                  "Available worldwide with support for multiple currencies and payment methods. Finance without borders.",
              },
              {
                icon: "mdi:chart-line",
                title: "Real-time Analytics",
                description:
                  "Track your transactions with detailed analytics and insights. Make informed financial decisions.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group relative p-8 rounded-3xl bg-black/30 backdrop-blur-xl border border-accent/20 hover:border-accent/50 transition-all duration-300 overflow-hidden"
              >
                <motion.div className="absolute inset-0 bg-linear-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br  from-accent/70 to-purple-600/20 mb-6 relative z-10 backdrop-blur-sm"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    boxShadow: "0 0 20px rgba(255, 79, 216, 0.15)",
                  }}
                >
                  <Icon icon={feature.icon} className="text-3xl text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 text-white relative z-10">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed relative z-10">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-32 px-6 lg:px-12 ">
        <FloatingElement
          className="top-20 left-20"
          delay={1}
          size="w-20 h-20"
          mobileHidden={true}
        />
        <FloatingElement
          className="bottom-10 right-32"
          delay={2}
          size="w-16 h-16"
          gradient
          mobileHidden={true}
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-20">
            <motion.h2
              className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h2>
            <motion.p
              className="text-xl text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Simple, secure, and straightforward. Get started in just three
              easy steps.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Lines */}
            <ConnectionLines />

            {[
              {
                step: "01",
                title: "Connect Wallet",
                description:
                  "Connect your Web3 wallet securely using RainbowKit. Support for MetaMask, WalletConnect, and more.",
                icon: "mdi:wallet",
              },
              {
                step: "02",
                title: "Choose Amount",
                description:
                  "Select your desired amount and currency. Our smart contracts handle the rest with transparent pricing.",
                icon: "mdi:currency-usd",
              },
              {
                step: "03",
                title: "Complete Transaction",
                description:
                  "Confirm your transaction and receive your funds instantly. All receipts are stored securely on 0G Network.",
                icon: "mdi:check-circle",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative text-center group"
              >
                <motion.div
                  className="relative inline-flex items-center justify-center w-32 h-32 rounded-full bg-linear-to-br from-accent/70 to-purple-600/20 mb-8 backdrop-blur-sm"
                  whileHover={{ scale: 1.05, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    boxShadow: "0 0 30px rgba(255, 79, 216, 0.2)",
                  }}
                >
                  <Icon icon={step.icon} className="text-5xl text-white" />
                  <motion.div
                    className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-black border-2 border-accent flex items-center justify-center text-sm font-bold text-accent"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {step.step}
                  </motion.div>
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-32 px-6 lg:px-12">
        <FloatingElement
          className="top-1/2 right-10"
          delay={0.8}
          size="w-20 h-20"
          gradient
          mobileHidden={true}
        />
        <FloatingElement
          className="bottom-20 left-1/4"
          delay={1.8}
          size="w-14 h-14"
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "$50M+", label: "Total Volume", icon: "mdi:chart-line" },
              {
                value: "10K+",
                label: "Active Users",
                icon: "mdi:account-group",
              },
              { value: "99.9%", label: "Uptime", icon: "mdi:server" },
              { value: "<2s", label: "Avg. Speed", icon: "mdi:speedometer" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -10 }}
                className="text-center group relative"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br  from-accent/70 to-purple-600/20 mb-6 relative z-10"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    boxShadow: "0 0 30px rgba(255, 79, 216, 0.2)",
                  }}
                >
                  <Icon icon={stat.icon} className="text-3xl text-white" />
                </motion.div>
                <motion.div
                  className="text-4xl md:text-5xl font-bold text-white mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-400 text-lg">{stat.label}</div>
                <motion.div className="absolute inset-0 bg-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 lg:px-12 overflow-hidden">
        <FloatingElement
          className="top-10 left-10"
          delay={0.5}
          size="w-24 h-24"
          gradient
          mobileHidden={true}
        />
        <FloatingElement
          className="bottom-10 right-10"
          delay={1.5}
          size="w-20 h-20"
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Join thousands of users who trust 0G Ramp for their fiat-to-crypto
            needs. Experience the future of decentralized finance today.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/dashboard"
                className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-2xl bg-linear-to-r  from-accent to-purple-600 text-white shadow-2xl overflow-hidden"
                style={{
                  boxShadow: "0 0 40px rgba(255, 79, 216, 0.2)",
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-purple-600 to-accent"
                  initial={{ x: "100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
                <Icon
                  icon="mdi:rocket-launch"
                  className="mr-3 text-xl relative z-10"
                />
                <span className="relative z-10">Launch App</span>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/transactions"
                className="group inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-2xl bg-black/40 backdrop-blur-xl hover:bg-black/60 text-white border border-accent/30 hover:border-accent/60 transition-all duration-300"
              >
                <Icon
                  icon="mdi:clipboard-text"
                  className="mr-3 text-xl text-accent"
                />
                View Transactions
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 px-6 lg:px-12 border-t border-accent/20">
        <FloatingElement
          className="top-10 right-1/4"
          delay={1}
          size="w-16 h-16"
        />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <motion.div
              className="col-span-1 md:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Icon icon="mdi:bridge" className="text-accent text-4xl" />
                </motion.div>
                <span className="font-bold text-3xl bg-linear-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent">
                  0G Ramp
                </span>
              </div>
              <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
                The future of decentralized finance. Seamless, secure, and
                lightning-fast fiat-to-crypto bridge built on 0G Network.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: "mdi:twitter", href: "#" },
                  { icon: "mdi:discord", href: "#" },
                  { icon: "mdi:telegram", href: "#" },
                  { icon: "mdi:github", href: "#" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-black/30 backdrop-blur-xl hover:bg-linear-to-br hover:from-accent hover:to-purple-600 text-gray-400 hover:text-white transition-all duration-300 border border-accent/20 hover:border-accent/50"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      boxShadow: "0 0 20px rgba(255, 79, 216, 0.2)",
                    }}
                  >
                    <Icon icon={social.icon} className="text-xl" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="font-semibold text-white mb-6 text-lg">Product</h4>
              <ul className="space-y-4">
                {["Dashboard", "Transactions", "API Docs", "Support"].map(
                  (item, index) => (
                    <motion.li key={index} whileHover={{ x: 5 }}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-accent transition-colors flex items-center gap-2"
                      >
                        <motion.span
                          initial={{ width: 0 }}
                          whileHover={{ width: 8 }}
                          className="h-0.5 bg-accent"
                        />
                        {item}
                      </a>
                    </motion.li>
                  )
                )}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-semibold text-white mb-6 text-lg">Company</h4>
              <ul className="space-y-4">
                {["About", "Blog", "Careers", "Contact"].map((item, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-accent transition-colors flex items-center gap-2"
                    >
                      <motion.span
                        initial={{ width: 0 }}
                        whileHover={{ width: 8 }}
                        className="h-0.5 bg-accent"
                      />
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            className="pt-8 border-t border-accent/20 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400 text-sm">
              © 2025 0G Ramp. All rights reserved.
            </p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <motion.a
                href="#"
                className="text-gray-400 hover:text-accent text-sm transition-colors"
                whileHover={{ y: -2 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-accent text-sm transition-colors"
                whileHover={{ y: -2 }}
              >
                Terms of Service
              </motion.a>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

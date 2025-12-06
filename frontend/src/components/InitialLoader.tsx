import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

interface InitialLoaderProps {
  onLoadComplete?: () => void;
}

export function InitialLoader({ onLoadComplete }: InitialLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [isExpanding, setIsExpanding] = useState(false);
  const [loadingStage, setLoadingStage] = useState("Initializing");

  useEffect(() => {
    // Start loading progress immediately
    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + Math.random() * 15;

        // Update loading stage based on progress
        if (nextProgress >= 80) {
          setLoadingStage("Almost there");
        } else if (nextProgress >= 60) {
          setLoadingStage("Loading assets");
        } else if (nextProgress >= 40) {
          setLoadingStage("Connecting to network");
        } else if (nextProgress >= 20) {
          setLoadingStage("Setting up");
        }

        if (nextProgress >= 100) {
          clearInterval(interval);
          setLoadingStage("Complete");
          // Trigger expansion animation
          setTimeout(() => {
            setIsExpanding(true);
          }, 300);
          // Hide loader after expansion
          setTimeout(() => {
            setShowLoader(false);
            onLoadComplete?.();
          }, 1500);
          return 100;
        }
        return nextProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  return (
    <AnimatePresence mode="wait">
      {showLoader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 bg-black text-white overflow-hidden z-9999 flex items-center justify-center"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Grid Pattern */}
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 79, 216, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 79, 216, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: "50px 50px",
              }}
              animate={{
                opacity: isExpanding ? [0.2, 0] : [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: isExpanding ? 0.8 : 3,
                repeat: isExpanding ? 0 : Infinity,
              }}
            />

            {/* Glowing Orbs */}
            <motion.div
              animate={
                isExpanding
                  ? { scale: 3, opacity: 0 }
                  : { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }
              }
              transition={{
                duration: isExpanding ? 1 : 4,
                repeat: isExpanding ? 0 : Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(255, 79, 216, 0.4) 0%, transparent 70%)",
              }}
            />
            <motion.div
              animate={
                isExpanding
                  ? { scale: 3, opacity: 0 }
                  : { scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }
              }
              transition={{
                duration: isExpanding ? 1 : 5,
                repeat: isExpanding ? 0 : Infinity,
                ease: "easeInOut",
                delay: isExpanding ? 0.1 : 1,
              }}
              className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
              }}
            />

            {/* Animated Particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-[#FF4FD8] rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={
                  isExpanding
                    ? { scale: 0, opacity: 0 }
                    : { y: [0, -100, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }
                }
                transition={{
                  duration: isExpanding ? 0.5 : 3 + Math.random() * 2,
                  repeat: isExpanding ? 0 : Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}

            {/* Floating Elements */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isExpanding
                  ? { scale: 50, opacity: 0, x: "-50vw", y: "-50vh" }
                  : { scale: 1, opacity: 0.6, y: [0, -20, 0], rotate: [0, 180, 360] }
              }
              transition={
                isExpanding
                  ? { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
                  : {
                      scale: { duration: 1, ease: [0.22, 1, 0.36, 1] },
                      opacity: { duration: 1 },
                      y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                    }
              }
              className="absolute top-1/4 left-20 w-16 h-16 bg-[#FF4FD8]/20 backdrop-blur-xl rounded-3xl border border-[#FF4FD8]/30"
              style={{ boxShadow: "0 0 30px rgba(255, 79, 216, 0.3)" }}
            />

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isExpanding
                  ? { scale: 50, opacity: 0, x: "50vw", y: "-50vh" }
                  : { scale: 1, opacity: 0.6, y: [0, -25, 0], rotate: [0, -180, -360] }
              }
              transition={
                isExpanding
                  ? { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }
                  : {
                      scale: { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
                      opacity: { duration: 1.2, delay: 0.2 },
                      y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 7, repeat: Infinity, ease: "linear" },
                    }
              }
              className="absolute top-1/3 right-32 w-12 h-12 bg-linear-to-br from-[#FF4FD8]/20 to-purple-600/20 backdrop-blur-xl rounded-3xl border border-[#FF4FD8]/30"
              style={{ boxShadow: "0 0 40px rgba(255, 79, 216, 0.3)" }}
            />

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isExpanding
                  ? { scale: 50, opacity: 0, x: "0", y: "50vh" }
                  : { scale: 1, opacity: 0.6, y: [0, -30, 0], rotate: [0, 360, 720] }
              }
              transition={
                isExpanding
                  ? { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }
                  : {
                      scale: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.4 },
                      opacity: { duration: 1.4, delay: 0.4 },
                      y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    }
              }
              className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-linear-to-br from-[#FF4FD8]/20 to-purple-600/20 backdrop-blur-xl rounded-3xl border border-[#FF4FD8]/30"
              style={{ boxShadow: "0 0 40px rgba(255, 79, 216, 0.3)" }}
            />

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isExpanding
                  ? { scale: 45, opacity: 0, x: "-30vw", y: "30vh" }
                  : { scale: 1, opacity: 0.5, y: [0, -15, 0], rotate: [0, 90, 180] }
              }
              transition={
                isExpanding
                  ? { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.05 }
                  : {
                      scale: { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
                      opacity: { duration: 1.1, delay: 0.3 },
                      y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 7, repeat: Infinity, ease: "linear" },
                    }
              }
              className="absolute bottom-1/3 right-1/4 w-14 h-14 bg-[#FF4FD8]/15 backdrop-blur-xl rounded-3xl border border-[#FF4FD8]/30"
              style={{ boxShadow: "0 0 35px rgba(255, 79, 216, 0.3)" }}
            />

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isExpanding
                  ? { scale: 55, opacity: 0, x: "40vw", y: "40vh" }
                  : { scale: 1, opacity: 0.5, y: [0, -18, 0], rotate: [0, -90, -180] }
              }
              transition={
                isExpanding
                  ? { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }
                  : {
                      scale: { duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.5 },
                      opacity: { duration: 1.3, delay: 0.5 },
                      y: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 6.5, repeat: Infinity, ease: "linear" },
                    }
              }
              className="absolute top-1/2 left-1/4 w-18 h-18 bg-linear-to-br from-purple-600/20 to-[#FF4FD8]/20 backdrop-blur-xl rounded-3xl border border-[#FF4FD8]/30"
              style={{ boxShadow: "0 0 35px rgba(255, 79, 216, 0.3)" }}
            />
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isExpanding ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }
            }
            transition={{
              duration: isExpanding ? 0.6 : 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-10 flex flex-col items-center justify-center gap-8 px-4"
          >
            {/* Logo with Rotation */}
            <motion.div
              className="relative"
              animate={
                isExpanding ? { rotate: 360, scale: 0 } : { rotate: [0, 360] }
              }
              transition={
                isExpanding
                  ? { duration: 0.6 }
                  : { duration: 3, repeat: Infinity, ease: "linear" }
              }
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-[#FF4FD8]/30"
                  animate={
                    isExpanding
                      ? { scale: 2, opacity: 0 }
                      : { scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }
                  }
                  transition={{
                    duration: isExpanding ? 0.6 : 2,
                    repeat: isExpanding ? 0 : Infinity,
                  }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border-2 border-[#FF4FD8]/50"
                  animate={
                    isExpanding
                      ? { scale: 2, opacity: 0, rotate: 180 }
                      : { scale: [1, 1.1, 1], rotate: [0, -360] }
                  }
                  transition={{
                    duration: isExpanding ? 0.6 : 3,
                    repeat: isExpanding ? 0 : Infinity,
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full blur-2xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255, 79, 216, 0.6) 0%, transparent 70%)",
                  }}
                  animate={
                    isExpanding
                      ? { scale: 3, opacity: 0 }
                      : { scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }
                  }
                  transition={{
                    duration: isExpanding ? 0.6 : 2,
                    repeat: isExpanding ? 0 : Infinity,
                  }}
                />
                <Icon
                  icon="mdi:bridge"
                  className="text-accent text-6xl relative z-10"
                />
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                isExpanding ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }
              }
              transition={
                isExpanding ? { duration: 0.4 } : { delay: 0.3, duration: 0.6 }
              }
              className="text-center space-y-3"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-[#FF4FD8] via-purple-400 to-[#FF4FD8] bg-clip-text text-transparent">
                0G Ramp
              </h2>
              <motion.p
                className="text-gray-400 text-base"
                animate={
                  isExpanding ? { opacity: 0 } : { opacity: [0.5, 1, 0.5] }
                }
                transition={
                  isExpanding ? { duration: 0.4 } : { duration: 2, repeat: Infinity }
                }
              >
                {progress >= 100
                  ? "Welcome to Web3! 🚀"
                  : "Initializing your gateway to Web3..."}
              </motion.p>
            </motion.div>

            {/* ENHANCED PROGRESS BAR */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                isExpanding ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }
              }
              transition={
                isExpanding ? { duration: 0.4 } : { delay: 0.5, duration: 0.6 }
              }
              className="w-80 max-w-[90vw] space-y-4"
            >
              {/* Loading Stage Label */}
              <motion.div
                className="flex items-center justify-between text-sm"
                layout
              >
                <motion.span
                  key={loadingStage}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-gray-400 font-medium"
                >
                  {loadingStage}
                </motion.span>
                <motion.span
                  className="text-accent font-bold tabular-nums"
                  animate={{
                    scale: progress >= 100 ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                >
                  {Math.round(progress)}%
                </motion.span>
              </motion.div>

              {/* Progress Bar Container with 3D Effect */}
              <div className="relative">
                {/* Outer Glow */}
                <motion.div
                  className="absolute -inset-2 bg-linear-to-r from-[#FF4FD8]/20 via-purple-600/20 to-[#FF4FD8]/20 rounded-full blur-xl"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />

                {/* Main Progress Bar */}
                <div className="relative h-3 bg-linear-to-r from-black/80 via-black/60 to-black/80 backdrop-blur-xl rounded-full overflow-hidden border border-[#FF4FD8]/30 shadow-inner">
                  {/* Background Pattern */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255, 79, 216, 0.1) 10px, rgba(255, 79, 216, 0.1) 20px)",
                    }}
                  />

                  {/* Progress Fill with Gradient */}
                  <motion.div
                    className="absolute inset-0 rounded-full overflow-hidden"
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {/* Animated Gradient Background */}
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-[#FF4FD8] via-purple-500 to-[#FF4FD8]"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        backgroundSize: "200% 100%",
                      }}
                    />

                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent"
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    {/* Top Highlight */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-white/50 to-transparent" />

                    {/* Moving Particles */}
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"
                        animate={{
                          x: ["0%", "100%"],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.4,
                          ease: "linear",
                        }}
                      />
                    ))}
                  </motion.div>

                  {/* Progress Indicator Dot */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg shadow-[#FF4FD8]/50 border-2 border-[#FF4FD8]"
                    initial={{ left: "0%" }}
                    animate={{
                      left: `${Math.min(progress, 100)}%`,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{
                      boxShadow: "0 0 20px rgba(255, 79, 216, 0.8)",
                      transform: "translateX(-50%) translateY(-50%)",
                    }}
                  >
                    {/* Pulsing Ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[#FF4FD8]"
                      animate={{
                        scale: [1, 1.8],
                        opacity: [0.8, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                  </motion.div>
                </div>

                {/* Bottom Reflection */}
                <motion.div
                  className="absolute top-full mt-1 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#FF4FD8]/20 to-transparent rounded-full blur-sm"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </div>

              {/* Milestone Indicators */}
              <div className="flex justify-between text-xs text-gray-600 px-1">
                {[0, 25, 50, 75, 100].map((milestone) => (
                  <motion.div
                    key={milestone}
                    className="flex flex-col items-center gap-1"
                    animate={{
                      color:
                        progress >= milestone
                          ? "rgb(255, 79, 216)"
                          : "rgb(75, 85, 99)",
                    }}
                  >
                    <motion.div
                      className="w-0.5 h-2 rounded-full"
                      animate={{
                        backgroundColor:
                          progress >= milestone
                            ? "rgb(255, 79, 216)"
                            : "rgb(75, 85, 99)",
                        height: progress >= milestone ? 8 : 4,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="font-medium">{milestone}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Loading Dots */}
            <motion.div
              className="flex gap-2"
              initial={{ opacity: 0 }}
              animate={isExpanding ? { opacity: 0 } : { opacity: 1 }}
              transition={
                isExpanding ? { duration: 0.3 } : { delay: 0.7, duration: 0.6 }
              }
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-[#FF4FD8]"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  style={{
                    boxShadow: "0 0 10px rgba(255, 79, 216, 0.5)",
                  }}
                />
              ))}
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isExpanding ? { opacity: 0 } : { opacity: 1 }}
              transition={
                isExpanding ? { duration: 0.3 } : { delay: 1, duration: 0.8 }
              }
              className="text-xs text-gray-500 tracking-wider uppercase"
            >
              Powered by 0G Network
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
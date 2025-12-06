import { motion } from "framer-motion";

interface FloatingElementProps {
  delay?: number;
  className?: string;
  size?: string;
  gradient?: boolean;
  mobileHidden?: boolean;
  initialLoad?: boolean;
}

const FloatingElement = ({
  delay = 0,
  className = "",
  size = "w-16 h-16",
  gradient = false,
  mobileHidden = false,
  initialLoad = false,
}: FloatingElementProps) => {
  const baseClasses = `${
    mobileHidden ? "hidden md:block" : ""
  } absolute ${size} ${
    gradient
      ? "bg-gradient-to-br from-[#FF4FD8]/20 to-purple-600/20"
      : "bg-[#FF4FD8]/10"
  } backdrop-blur-xl rounded-3xl border border-[#FF4FD8]/30 ${className}`;

  return (
    <motion.div
      initial={
        initialLoad
          ? {
              scale: 0,
              opacity: 0,
              rotate: -180,
            }
          : undefined
      }
      animate={{
        y: [0, -30, 0],
        rotate: [0, 180, 360],
        scale: [1, 1.1, 1],
        opacity: 1,
      }}
      transition={{
        duration: 8 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay: initialLoad ? delay + 1 : delay,
      }}
      className={baseClasses}
      style={{
        boxShadow: gradient
          ? "0 0 40px rgba(255, 79, 216, 0.3)"
          : "0 0 30px rgba(255, 79, 216, 0.15)",
      }}
    />
  );
}

export default FloatingElement;
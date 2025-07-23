"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface AnimatedButtonProps {
  children: React.ReactNode
  className?: string
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ children, className = "" }) => {
  const router = useRouter()

  const handleClick = () => {
    router.push("/login")
  }

  return (
    <motion.button
      className={`relative font-medium text-sm overflow-hidden transition-colors duration-500 ease-in-out ${className}`}
      onClick={handleClick}
      whileHover="hover"
      initial="initial"
    >
      <motion.div
        className="relative z-10 px-6 py-2"
        variants={{
          initial: { color: "#ffedd3" },
          hover: { color: "#1e1e2b", transition: { delay: 0.5 } },
        }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 w-full bg-[#ffc506]"
        variants={{
          initial: { width: 0 },
          hover: { width: "100%" },
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-full bg-[#B5A8D5] z-[-1]"
        variants={{
          initial: { height: 0 },
          hover: { height: "100%" },
        }}
        transition={{ duration: 0.4, ease: "easeInOut", delay: 0.2 }}
      />
    </motion.button>
  )
}

export default AnimatedButton


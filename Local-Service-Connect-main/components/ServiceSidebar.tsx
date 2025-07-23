"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt, IconPaint } from "@tabler/icons-react"

export function ServiceSidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
  const links = [
    {
      label: "All Services",
      href: "/services",
      icon: <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Plumbing",
      href: "/services/plumbing",
      icon: <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Cleaning",
      href: "/services/cleaning",
      icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Electrical",
      href: "/services/electrical",
      icon: <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Painting",
      href: "/services/painting",
      icon: <IconPaint className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ]

  return (
    <motion.aside
      initial={{ x: "-100%" }}
      animate={{ x: isOpen ? 0 : "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg",
        "flex flex-col md:hidden", // Hide on desktop
      )}
    >
      <div className="p-4 flex justify-between items-center">
        <Logo />
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <IconArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-4">
          {links.map((link, idx) => (
            <li key={idx}>
              <Link
                href={link.href}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/"
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <Image src="/logo.png" className="h-8 w-8 rounded-full" width={32} height={32} alt="Logo" />
          <span>Local Service Connect</span>
        </Link>
      </div>
    </motion.aside>
  )
}

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2 text-xl font-semibold">
      <div className="h-8 w-8 bg-black dark:bg-white rounded-lg" />
      <span className="text-black dark:text-white">Local Service Connect</span>
    </Link>
  )
}


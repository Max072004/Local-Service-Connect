"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Card {
  title: string
  src: string
  description: string
  slug: string
}

export const FocusCards = ({
  cards,
}: {
  cards: Card[]
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {cards.map((card, index) => (
        <Link
          key={card.title}
          href={`/services/${card.slug}`}
          className={cn(
            "relative overflow-hidden rounded-lg shadow-md transition-all duration-500 ease-in-out",
            "h-[300px] md:h-[400px]",
            "w-full group",
          )}
          onMouseEnter={() => setFocusedIndex(index)}
          onMouseLeave={() => setFocusedIndex(null)}
        >
          <Image
            src={card.src || "/placeholder.svg"}
            alt={card.title}
            fill
            className="object-cover transition-all duration-500 ease-in-out group-hover:scale-110"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-purple-900 via-purple-800/80 to-transparent flex flex-col justify-end p-6"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: focusedIndex === index ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-white text-2xl font-semibold mb-2">{card.title}</h3>
            <p
              className={cn(
                "text-white text-sm transition-all duration-500 ease-in-out",
                focusedIndex === index ? "opacity-100" : "opacity-0",
              )}
            >
              {card.description}
            </p>
          </motion.div>
        </Link>
      ))}
    </div>
  )
}


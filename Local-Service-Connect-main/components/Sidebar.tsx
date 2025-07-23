import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const categories = [
    { name: "All Services", href: "/services" },
    { name: "Plumbing", href: "/services#plumbing" },
    { name: "Cleaning", href: "/services#cleaning" },
    { name: "Electrical", href: "/services#electrical" },
    { name: "Painting", href: "/services#painting" },
  ]

  return (
    <div className={cn("bg-[#E3F4F4] p-6 rounded-lg shadow-md", className)}>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Categories</h2>
      <nav>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.name}>
              <Link href={category.href} className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar


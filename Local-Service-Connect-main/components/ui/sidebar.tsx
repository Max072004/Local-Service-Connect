"use client"
import type React from "react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({ open, setOpen, className }) => {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800",
        className,
      )}
    >
      <div className="flex items-center justify-between p-4">{/* Logo or title here */}</div>
      <div className="p-4">{/* Sidebar content here */}</div>
    </aside>
  )
}

export const SidebarBody = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col">{children}</div>
}

export const SidebarLink = ({ link }: { link: { label: string; href: string; icon?: React.ReactNode } }) => {
  return (
    <Link href={link.href} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
      {link.icon}
      {link.label}
    </Link>
  )
}


import type { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">{children}</div>
}


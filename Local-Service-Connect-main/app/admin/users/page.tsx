"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Settings, Menu, Trash2 } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function UsersPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adminUser, setAdminUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      if (parsed.role === "admin") setAdminUser(parsed)
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch("https://major-backend-f0nm.onrender.com/api/v1/users/getalluser")
        if (!res.ok) throw new Error("Failed to fetch users")

        const data = await res.json()
        const customers = Array.isArray(data?.users)
          ? data.users.filter((u) => u.role === "customer")
          : []

        if (!Array.isArray(data?.users)) {
          console.error("Invalid users data format")
          setError("Unexpected response structure")
        }

        setUsers(customers)
      } catch (err) {
        console.error("Fetch error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])


const handleDeleteUser = async (userId) => {
  const confirm = window.confirm("Are you sure you want to delete this user?")
  if (!confirm) return

  try {
    const res = await axios.delete(
      `https://major-backend-f0nm.onrender.com/api/v1/users/delete/${userId}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (res.status !== 200) throw new Error("Failed to delete user")

    setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userId))
    alert("User deleted successfully!") // ✅ Success message
  } catch (err) {
    console.error(err)
    alert("Failed to delete user: " + err.message)
  }
}


  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  const Sidebar = () => (
    <div className="w-64 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-xl h-full flex flex-col">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
      </div>

      {adminUser && (
        <div className="px-4 py-3 bg-gray-800/50 mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-indigo-500">
              <AvatarImage src={adminUser.profilePic?.url || ""} alt={adminUser.name} />
              <AvatarFallback className="bg-indigo-600 text-white">
                {adminUser.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-sm font-medium text-white">{adminUser.name}</span>
              <span className="text-xs text-gray-400">{adminUser.email}</span>
            </div>
          </div>
        </div>
      )}

      <Separator className="bg-gray-700 my-2" />

      <nav className="mt-2 flex-1">
        {[
          { name: "Overview", href: "/admin/dashboard" },
          { name: "Workers", href: "/admin/workers" },
          { name: "Users", href: "/admin/users" },
        ].map((item) => (
          <Link key={item.name} href={item.href}>
            <Button
              variant={item.name === "Users" ? "default" : "ghost"}
              className="w-full justify-start rounded-none py-2 px-4 text-gray-200 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 hover:text-white hover:translate-x-1"
            >
              {item.name}
            </Button>
          </Link>
        ))}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start rounded-none py-2 px-4 text-gray-200 hover:bg-red-600/20 hover:text-red-500"
        >
          Logout
        </Button>
      </nav>
    </div>
  )

  return (
    <div className="flex h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden mr-2">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <Sidebar />
                </SheetContent>
              </Sheet>
              <h1 className="text-2xl font-semibold text-indigo-900">Users</h1>
            </div>
            {adminUser && (
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-sm font-medium">Welcome, {adminUser.name}</span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={adminUser.profilePic?.url || ""} alt={adminUser.name} />
                  <AvatarFallback className="bg-indigo-600 text-white">
                    {adminUser.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle>Customer List</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <p>Loading users...</p>
                ) : error ? (
                  <p className="text-red-500">Error: {error}</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b-2 border-gray-200">
                        <TableHead className="font-bold text-gray-700">Profile Pic</TableHead>
                        <TableHead className="font-bold text-gray-700">Name</TableHead>
                        <TableHead className="font-bold text-gray-700">Email</TableHead>
                        <TableHead className="font-bold text-gray-700">Created At</TableHead>
                        <TableHead className="font-bold text-gray-700 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id} className="hover:bg-gray-50">
                          <TableCell>
                            <Image
                              src={user.profilePic?.url || "/placeholder.png"}
                              alt={user.name}
                              width={50}
                              height={50}
                              className="rounded-full"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(user._id)}
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

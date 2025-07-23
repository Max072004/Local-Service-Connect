"use client"

import { useEffect, useState } from "react"
import { Settings, Menu, Trash2 } from "lucide-react"
import Link from "next/link"
import axios from "axios";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { ProfileSettingsDialog } from "@/components/ProfileSettingsDialog"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function WorkersPage() {
  const [workers, setWorkers] = useState([])
  const [selectedService, setSelectedService] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adminUser, setAdminUser] = useState(null)

  useEffect(() => {
    // Get admin user from localStorage
    const user = localStorage.getItem("user")
    if (user) {
      const parsedUser = JSON.parse(user)
      if (parsedUser.role === "admin") {
        setAdminUser(parsedUser)
      }
    }

    const fetchWorkers = async () => {
      try {
        const response = await fetch("https://major-backend-f0nm.onrender.com/api/v1/worker/getall")
        if (!response.ok) throw new Error("Failed to fetch data")

        const data = await response.json()

        if (!data.success || !Array.isArray(data.worker)) throw new Error("Invalid API response format")

        setWorkers(data.worker)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setWorkers([])
        setLoading(false)
      }
    }

    fetchWorkers()
  }, [])

  const handleDeleteWorker = async (workerId: string) => {
    console.log("Attempting to delete worker with ID:", workerId); 
    const confirmDelete = window.confirm("Are you sure you want to delete this worker?");
    if (!confirmDelete) return;
  
    try {
      const deleteUrl = `https://major-backend-f0nm.onrender.com/api/v1/users/delete/${workerId}`;
      console.log("Delete URL:", deleteUrl); 
      const response = await axios.delete(deleteUrl, {
        withCredentials: true,
      });
  
      if (response.data.success) {
        setWorkers((prevWorkers) => prevWorkers.filter((worker) => worker._id !== workerId));
        alert("Worker deleted successfully!");
      } else {
        throw new Error(response.data.message || "Failed to delete worker.");
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      alert("Failed to delete worker: " + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  const filteredWorkers =
    selectedService === "All" ? workers : workers.filter((worker) => worker.serviceType.includes(selectedService))

  const totalWorkers = workers.length

  const averageRating =
    workers.length > 0
      ? (workers.reduce((sum, worker) => sum + (worker.rating || 0), 0) / workers.length).toFixed(1)
      : "N/A"

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
              <AvatarFallback className="bg-indigo-600 text-white">{adminUser.name?.charAt(0) || "A"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
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
              variant={item.name === "Workers" ? "default" : "ghost"}
              className="w-full justify-start rounded-none py-2 px-4 text-gray-200 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 hover:text-white hover:translate-x-1"
            >
              {item.name}
            </Button>
          </Link>
        ))}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-none py-2 px-4 text-gray-200 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 hover:text-white hover:translate-x-1"
            >
              <Settings className="mr-2 h-4 w-4" />
              Profile Settings
            </Button>
          </DialogTrigger>
          <ProfileSettingsDialog />
        </Dialog>
      </nav>
    </div>
  )

  return (
    <div className="flex h-screen bg-[#F7F9FB]">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
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
              <h1 className="text-2xl font-semibold text-indigo-900">Workers</h1>
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

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F7F9FB]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Display loading or error message */}
            {loading && <p className="text-center text-gray-500">Loading workers...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
              <>
                <Card className="mb-8 border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                    <CardTitle>Worker Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <p className="text-sm text-gray-600 font-medium">Total Workers</p>
                        <p className="text-3xl font-bold text-indigo-600 mt-2">{totalWorkers}</p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <p className="text-sm text-gray-600 font-medium">Average Rating</p>
                        <p className="text-3xl font-bold text-indigo-600 mt-2">{averageRating}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">Worker List</h2>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="w-[180px] border-gray-200 shadow-sm">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Services</SelectItem>
                      <SelectItem value="Plumbing">Plumbing</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Cleaning">Cleaning</SelectItem>
                      <SelectItem value="Painting">Painting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkers.map((worker) => (
                      <TableRow key={worker._id}>
                        <TableCell>{worker.name}</TableCell>
                        <TableCell>{worker.serviceType.join(", ")}</TableCell>
                        <TableCell>{worker.rating || "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteWorker(worker._id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
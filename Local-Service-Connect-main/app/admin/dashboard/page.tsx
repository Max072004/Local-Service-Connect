"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ArrowRight, Users, Briefcase, IndianRupee, Calendar, Settings, Menu } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ProfileSettingsDialog } from "@/components/ProfileSettingsDialog"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const USD_TO_INR = 83 // 1 USD = 83 INR

const data = [
  { name: "Jan", total: (Math.floor(Math.random() * 5000) + 1000) * USD_TO_INR },
  { name: "Feb", total: (Math.floor(Math.random() * 5000) + 1000) * USD_TO_INR },
  { name: "Mar", total: (Math.floor(Math.random() * 5000) + 1000) * USD_TO_INR },
  { name: "Apr", total: (Math.floor(Math.random() * 5000) + 1000) * USD_TO_INR },
  { name: "May", total: (Math.floor(Math.random() * 5000) + 1000) * USD_TO_INR },
  { name: "Jun", total: (Math.floor(Math.random() * 5000) + 1000) * USD_TO_INR },
  { name: "Jul", total: (Math.floor(Math.random() * 5000) + 1000) * USD_TO_INR },
  { name: "Aug", total: (Math.floor(Math.random() * 5000) + 1000) * USD_TO_INR },
  { name: "Sep", total: (Math.floor(Math.random() * 5000) + 1000) * USD_TO_INR },
  { name: "Oct", total: (Math.floor(Math.random() * 5000) + 1000) * USD_TO_INR },
  { name: "Nov", total: (Math.floor(Math.random() * 5000) + 1000) * USD_TO_INR },
  { name: "Dec", total: (Math.floor(Math.random() * 5000) + 1000) * USD_TO_INR },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [adminUser, setAdminUser] = useState(null)

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  //code to redirect to login page if user is not admin
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const parsedUser = JSON.parse(user)
      if (parsedUser.role !== "admin") {
        router.push("/login")
      } else {
        setAdminUser(parsedUser)
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const Sidebar = () => (
    <div className="w-64 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-xl h-full flex flex-col">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
      </div>

      {/* Admin Profile Section */}
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
              variant="ghost"
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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-lg backdrop-blur-lg bg-opacity-80">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden mr-2 hover:rotate-180 transition-transform duration-300"
                  >
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <Sidebar />
                </SheetContent>
              </Sheet>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {adminUser && (
                <div className="hidden md:flex items-center space-x-3 mr-2">
                  <span className="text-sm font-medium">Welcome, {adminUser.name}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={adminUser.profilePic?.url || ""} alt={adminUser.name} />
                    <AvatarFallback className="bg-indigo-600 text-white">
                      {adminUser.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Quick stats */}
            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: "Total Users",
                  icon: Users,
                  value: "8",
                  change: "+10%",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  title: "Active Workers",
                  icon: Briefcase,
                  value: "16",
                  change: "+5%",
                  color: "from-green-500 to-green-600",
                },
                {
                  title: "Total Revenue",
                  icon: IndianRupee,
                  value: `₹${(120.89 * USD_TO_INR).toLocaleString("en-IN")}`,
                  change: "+20%",
                  color: "from-purple-500 to-purple-600",
                },
                
              ].map((item, index) => (
                <Card
                  key={index}
                  className="overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-10`}></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <p className="text-xs text-muted-foreground">{item.change} from last month</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Revenue chart */}
            <Card className="mb-8 overflow-hidden transform hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    total: {
                      label: "Total",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="min-h-[300px]"
                >
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                      />
                      <ChartTooltip
                        cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
                        content={
                          <ChartTooltipContent className="bg-white p-2 shadow-lg rounded-lg border border-gray-200" />
                        }
                      />
                      <Bar
                        dataKey="total"
                        fill="url(#colorGradient)"
                        radius={[4, 4, 0, 0]}
                        className="transition-all duration-300 hover:brightness-110"
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Recent activities */}
            <Card className="transform hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>You have 3 new activities today</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        activity: "New user registration",
                        status: "Completed",
                        date: "2023-06-15",
                      },
                      {
                        activity: "Service booking: Plumbing",
                        status: "In Progress",
                        date: "2023-06-14",
                      },
                      {
                        activity: "Worker application: Electrician",
                        status: "Pending Review",
                        date: "2023-06-13",
                      },
                    ].map((item, index) => (
                      <TableRow key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        <TableCell className="font-medium">{item.activity}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-105 ${
                              item.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : item.status === "In Progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:scale-105 transition-transform duration-200"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Quick actions */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Quick Actions
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { 
                    title: "Add New Service", 
                    icon: ArrowRight,
                    description: "Create and publish new service offerings",
                    color: "from-indigo-600 to-purple-600"
                  },
                  { 
                    title: "Review Worker Applications", 
                    icon: ArrowRight,
                    description: "Manage and approve worker registrations",
                    color: "from-blue-600 to-cyan-600"
                  },
                  { 
                    title: "Generate Monthly Report", 
                    icon: ArrowRight,
                    description: "Download detailed performance analytics",
                    color: "from-emerald-600 to-teal-600"
                  },
                ].map((action, index) => (
                  <Button
                    key={index}
                    className={`w-full flex flex-col items-start p-6 bg-gradient-to-r ${action.color} text-white hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl rounded-2xl font-semibold relative overflow-hidden group`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className="relative w-full">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold">{action.title}</h3>
                        <action.icon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                      <p className="text-sm text-white/80">{action.description}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

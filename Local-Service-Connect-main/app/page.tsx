"use client"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { HoverEffect } from "@/components/HoverEffect"
import { FlipWords } from "@/components/FlipWords"
import AnimatedButton from "@/components/AnimatedButton"
import { Menu, X, CreditCard, KeyRound } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import emailjs from "@emailjs/browser"

export default function LandingPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [currentUser, setCurrentUser] = useState(null)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    // Get user from localStorage
    const user = localStorage.getItem("user")
    try {
      if (user && user !== "undefined") {
        const parsedUser = JSON.parse(user)
        setCurrentUser(parsedUser)
      }
    } catch (error) {
      console.error("Failed to parse user JSON:", error)
    }
  }, [])

  const handlePlansClick = () => {
    if (currentUser?.role === "worker") {
      router.push("/worker-subscription")
    } else {
      router.push("/customer-subscription")
    }
  }

  const services = [
    {
      title: "Plumbing",
      description: "Expert plumbing services for all your household needs.",
      link: "/services/plumbing",
    },
    {
      title: "Electrical",
      description: "Professional electrical work to keep your home powered and safe.",
      link: "/services/electrician",
    },
    {
      title: "Cleaning",
      description: "Thorough cleaning services to maintain a spotless home.",
      link: "/services/cleaning",
    },
    {
      title: "Carpentry",
      description: "Skilled carpentry for repairs, renovations, and custom projects.",
      link: "/services/carpenter",
    },
    {
      title: "Painting",
      description: "Transform your space with our professional painting services.",
      link: "/services/painting",
    },
    {
      title: "Gardening",
      description: "Keep your outdoor areas beautiful with our gardening expertise.",
      link: "/services/gardening",
    },
  ]

  const handlelogout = async () => {
    try {
      const response = await axios.get(`https://major-backend-f0nm.onrender.com/api/v1/users/logout`, {
        withCredentials: true,
      })

      if (response?.data?.success) {
        localStorage.removeItem("user")
        setCurrentUser(null)
        toast.success("Logout done")
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } else {
        toast.error("Logout failed: Invalid response")
      }
    } catch (error) {
      console.error("Logout error: ", error)
      toast.error("Logout failed: Network or server error")
    }
  }

  const flipWords = [
    "Connecting You to Trusted Local Experts!",
    "Quick, Reliable, and Hassle-Free Home Services!",
    "Find. Hire. Get It Done!",
    "Your One-Stop Solution for Home Services!",
  ]

  const handleProfileClick = () => {
    setIsProfileDialogOpen(true)
  }
  // New state for change password form
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [isChanging, setIsChanging] = useState(false)

  // Change password handler
  const handleChangePassword = async () => {
    setPasswordMessage("")
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("All fields are required")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage("New password and confirm password do not match")
      return
    }
    setIsChanging(true)
    try {
      const res = await axios.put(
        "https://major-backend-f0nm.onrender.com/api/v1/users/changePassword",
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true },
      )
      setPasswordMessage(res.data.message || "Password changed successfully")
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error updating password"
      setPasswordMessage(msg)
    } finally {
      setIsChanging(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Map form field names to state property names
    const fieldToStateMap = {
      from_name: "name",
      reply_to: "email",
      message: "message",
    }

    const stateProperty = fieldToStateMap[name] || name

    setFormData((prev) => ({
      ...prev,
      [stateProperty]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await emailjs.sendForm("service_o39avue", "template_8hbdqf6", formRef.current, "PYGdYrESNEKTv8WuZ")

      console.log("Email sent successfully:", result.text)
      toast.success("Message sent successfully!")

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
      })
    } catch (error) {
      console.error("Failed to send email:", error)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 to-indigo-200 text-gray-800">
      <ToastContainer />
      <header className="bg-gradient-to-r from-purple-400 to-indigo-500 shadow-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                L
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              LOCAL SERVICE <span className="text-purple-200">CONNECT</span>
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection("services")}
              className="text-white hover:text-purple-200 transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-white/10"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-white hover:text-purple-200 transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-white/10"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-white hover:text-purple-200 transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-white/10"
            >
              Contact
            </button>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-full pl-3 pr-2 py-1.5 border border-white/30 shadow-lg hover:shadow-indigo-500/20">
                      <span className="text-white text-sm font-medium">{currentUser.name}</span>
                      <Avatar className="h-8 w-8 border-2 border-white/50 ring-2 ring-purple-600/20">
                        <AvatarImage src={currentUser.profilePic?.url || ""} alt={currentUser.name} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                          {currentUser.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 p-0 overflow-hidden border-none shadow-xl rounded-xl"
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 border-2 border-white/70 ring-2 ring-purple-600/20 shadow-lg">
                          <AvatarImage src={currentUser.profilePic?.url || ""} alt={currentUser.name} />
                          <AvatarFallback className="bg-white text-indigo-600 font-semibold">
                            {currentUser.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium text-base">{currentUser.name}</p>
                          <p className="text-purple-100 text-xs">{currentUser.email}</p>
                        </div>
                      </div>
                      <div className="mt-3 bg-white/20 rounded-md px-2 py-1 inline-block">
                        <p className="text-xs text-white capitalize font-medium">{currentUser.role}</p>
                      </div>
                    </div>

                    <div className="bg-white p-2">
                      <DropdownMenuItem
                        className="cursor-pointer flex items-center space-x-2 hover:bg-purple-50 rounded-md transition-colors duration-200 py-2.5"
                        onClick={handleProfileClick}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>Profile Settings</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer flex items-center space-x-2 hover:bg-purple-50 rounded-md transition-colors duration-200 py-2.5"
                        onClick={() => {
                          const user = localStorage.getItem("user")
                          if (user) {
                            const parsedUser = JSON.parse(user)
                            if (parsedUser.role === "worker") {
                              router.push("/plans/worker")
                            } else {
                              router.push("/plans/customer")
                            }
                          }
                        }}
                      >
                        <CreditCard className="h-4 w-4 text-indigo-600" />
                        <span>Subscription Plans</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="my-1 h-px bg-gray-200" />

                      <DropdownMenuItem
                        className="cursor-pointer flex items-center space-x-2 hover:bg-red-50 rounded-md transition-colors duration-200 py-2.5 text-red-500"
                        onClick={handlelogout}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <AnimatedButton className="relative overflow-hidden group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors duration-300"></div>
              </AnimatedButton>
            )}
          </div>
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-purple-400 to-indigo-500 py-4">
          <nav className="flex flex-col items-center space-y-4">
            <button
              onClick={() => scrollToSection("services")}
              className="text-white hover:text-purple-200 transition-colors duration-300"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-white hover:text-purple-200 transition-colors duration-300"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-white hover:text-purple-200 transition-colors duration-300"
            >
              Contact
            </button>

            {currentUser ? (
              <div className="flex flex-col items-center space-y-4 pt-4 pb-3 border-t border-white/20 w-full">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 border-2 border-white/50 ring-2 ring-purple-600/20 shadow-lg">
                    <AvatarImage src={currentUser.profilePic?.url || ""} alt={currentUser.name} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold">
                      {currentUser.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-semibold tracking-wide">{currentUser.name}</span>
                    <span className="text-purple-100/90 text-xs">{currentUser.email}</span>
                  </div>
                </div>
                <div className="flex flex-col w-full px-6 space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 border-white/30 text-white justify-start transition-all duration-300 hover:scale-[1.02]"
                    onClick={handleProfileClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile Settings
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 border-white/30 text-white justify-start transition-all duration-300 hover:scale-[1.02]"
                    onClick={handlePlansClick}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Subscription Plans
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 border-white/30 text-white justify-start transition-all duration-300 hover:scale-[1.02]"
                    onClick={() => router.push("/change-password")}
                  >
                    <KeyRound className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 border-white/30 text-white justify-start transition-all duration-300 hover:scale-[1.02]"
                    onClick={handlelogout}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <AnimatedButton className="group animate-rainbow text-white hover:text-purple-200 font-semibold tracking-wide">
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 group-hover:from-purple-600/30 group-hover:to-indigo-600/30 transition-all duration-300"></div>
              </AnimatedButton>
            )}
          </nav>
        </div>
      )}

      <main className="flex-grow">
        <motion.section
          className="bg-gradient-to-br from-purple-200 to-indigo-300 py-20 relative overflow-hidden"
          style={{
            backgroundPositionY: `${scrollY * 0.5}px`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl text-indigo-900"
              >
                <FlipWords
                  words={flipWords}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600"
                />
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-5 max-w-xl mx-auto text-xl text-indigo-700"
              >
                Connect with skilled local professionals for all your home service needs.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-8 flex justify-center"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                  onClick={() => scrollToSection("services")}
                >
                  Get Started
                </Button>
              </motion.div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-indigo-300 opacity-50"></div>
        </motion.section>

        <section id="services" className="py-16 bg-gradient-to-br from-purple-100 to-indigo-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl font-extrabold text-center mb-8 text-indigo-900"
            >
              Our Services
            </motion.h2>
            <HoverEffect items={services} />
          </div>
        </section>

        <section id="how-it-works" className="bg-gradient-to-br from-purple-300 to-indigo-400 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-extrabold text-center mb-12 text-white relative"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-200">
                How It Works
              </span>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-purple-200 to-indigo-200"
              ></motion.div>
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Book a Service",
                  description: "Choose the service you need and select a convenient time.",
                },
                {
                  title: "Get Matched",
                  description: "We'll connect you with a skilled local professional.",
                },
                {
                  title: "Job Done",
                  description: "Your service provider arrives and completes the job to your satisfaction.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border-t-4 border-purple-500"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                    className="flex items-center justify-center mb-4"
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                      {index + 1}
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-indigo-900 mb-2 text-center">{step.title}</h3>
                  <p className="text-indigo-700 text-center">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-16 bg-gradient-to-br from-purple-100 to-indigo-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl font-extrabold text-center mb-8 text-indigo-900"
            >
              Contact Us
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-lg shadow-xl p-6 md:p-8"
            >
              <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1 text-indigo-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="from_name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-purple-50 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-indigo-900"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1 text-indigo-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="reply_to"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-purple-50 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-indigo-900"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium mb-1 text-indigo-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 bg-purple-50 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-indigo-900"
                    required
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-r from-purple-400 to-indigo-500 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white mb-4 md:mb-0">&copy; 2025 LOCAL SERVICE CONNECT. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="#" className="text-white hover:text-purple-200 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="#" className="text-white hover:text-purple-200 transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-center">{/* ... avatar unchanged ... */}</div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={currentUser?.name || ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={currentUser?.email || ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Change Password</label>
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                  {passwordMessage && <p className="text-sm text-red-500">{passwordMessage}</p>}
                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl py-2 rounded-lg font-semibold relative overflow-hidden group"
                    onClick={handleChangePassword}
                    disabled={isChanging}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    <span className="relative">{isChanging ? "Updating..." : "Update Password"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client";
import { useState, useEffect } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://major-backend-f0nm.onrender.com/api/v1/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      if (response.ok) {
        console.log("Login successful:", data.user);
        toast.success("Login successful");
        const { role, subscription, free_Count } = data.user;
        if (data.user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
           setTimeout(() => {
             if (subscription.status === false && free_Count >= 3) {
               if (role === "customer") {
                 router.push("/plans/customer");
               } else if (role === "worker") {
                 router.push("/plans/worker");
               } else {
                 router.push("/");
               }
             } else {
               router.push("/");
             }
           }, 500); 
        }
        
      } else {
        setError(data.message || "Login failed");
        console.error("Login failed:", data.message);
        toast.error("Login failed");
      }
    } catch (err) {
      setError("Network error or server unavailable");
      console.error("Error during login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <ToastContainer />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 border border-white/20"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
              Welcome Back
            </h2>
            <p className="text-indigo-600/80">Sign in to continue to your account</p>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center mb-4 bg-red-50/80 p-3 rounded-lg border border-red-200"
            >
              {error}
            </motion.p>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-indigo-900/90"
              >
                Email
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/70 text-indigo-900 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 pl-10"
                  placeholder="Enter your email"
                  required
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-indigo-900/90"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/70 text-indigo-900 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 pl-10"
                  placeholder="Enter your password"
                  required
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl py-3 rounded-xl font-semibold text-lg relative overflow-hidden group"
              disabled={loading}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              {loading ? (
                <span className="flex items-center justify-center relative">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : "Login"}
            </Button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-indigo-900/80">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300 hover:underline"
              >
                Register
              </Link>
            </p>
            <Link 
              href="/" 
              className="text-indigo-900/80 hover:text-indigo-600 transition-colors duration-300 inline-flex items-center group"
            >
              <svg className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

"use client"

import type React from "react"

import { useState } from "react"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export function ProfileSettingsDialog() {
  const [name, setName] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleNameChange = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle name change logic here
    toast.success("Name updated successfully!")
    setName("")
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!")
      return
    }
    // Handle password change logic here
    toast.success("Password updated successfully!")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <DialogContent className="max-w-md bg-white backdrop-blur-sm bg-opacity-95 animate-in fade-in-0 zoom-in-95 duration-200">
      <DialogHeader className="border-b pb-3">
        <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Profile Settings
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 p-4">
        {/* Name Change Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 py-3">
            <CardTitle className="text-base font-semibold text-gray-900">Change Name</CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <form onSubmit={handleNameChange} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm text-gray-700">New Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your new name"
                  required
                  className="h-9 text-sm border-gray-200"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-md transition-colors"
              >
                Update Name
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Change Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 py-3">
            <CardTitle className="text-base font-semibold text-gray-900">Change Password</CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword" className="text-sm text-gray-700">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="h-9 text-sm border-gray-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-sm text-gray-700">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="h-9 text-sm border-gray-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm text-gray-700">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="h-9 text-sm border-gray-200"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-md transition-colors"
              >
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  )
}

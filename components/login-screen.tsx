"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, User } from "lucide-react"

interface LoginScreenProps {
  onLogin: (isAuthenticated: boolean) => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Update document title for consistent branding
    document.title = "Secure Login | Gencore IT Solutions"
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate a slight delay for authentication
    setTimeout(() => {
      if (username === "mnrnauman" && password === "precision9911") {
        // Store authentication in session storage
        sessionStorage.setItem("gencoreAuth", "true")
        onLogin(true)
        // Update title after successful login
        document.title = "Document Generator | Gencore IT Solutions"
      } else {
        setError("Invalid username or password. Please try again.")
        setIsLoading(false)
      }
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative mb-2">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#1e40af] to-[#f97316] rounded-full blur-sm opacity-30"></div>
              <div className="relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Right%20Logo-pcG5xhUOcBvEaMtBemNZplMKUox6rR.png"
                  alt="Gencore IT Solutions Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#1e40af]">Gencore IT Solutions</h1>
            <p className="text-[#f97316] text-sm font-medium">Document Generator - Secure Access</p>
          </div>

          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e40af] to-[#f97316]"></div>
            <div className="pt-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Login</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-1">
                    <User size={16} />
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    autoComplete="username"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-1">
                    <Lock size={16} />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full"
                  />
                </div>

                <Button type="submit" className="w-full bg-[#1e40af] hover:bg-[#1e3a8a]" disabled={isLoading}>
                  {isLoading ? "Authenticating..." : "Login"}
                </Button>
              </form>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Authorized access only. Please contact the administrator if you need access.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

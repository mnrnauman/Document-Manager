"use client"

import { useState, useEffect } from "react"
import TemplateSelector from "@/components/template-selector"
import LoginScreen from "@/components/login-screen"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated in this session
    const authStatus = sessionStorage.getItem("gencoreAuth")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (status: boolean) => {
    setIsAuthenticated(status)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1e40af] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1e40af] mb-2">
            Gencore IT Solutions - Document Generator
          </h1>
          <p className="text-gray-600">Create, edit, and download professional business documents</p>
        </div>

        <TemplateSelector />
      </div>
    </main>
  )
}

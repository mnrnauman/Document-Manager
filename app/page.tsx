"use client"

import LoginScreen from "@/components/login-screen"

export default function Home() {
  const handleLogin = (status: boolean) => {
    if (status) {
      window.location.href = "/letterhead"
    }
  }

  return <LoginScreen onLogin={handleLogin} />
}

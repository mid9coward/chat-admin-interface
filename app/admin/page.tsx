"use client"

import { useState } from "react"
import { AdminLogin } from "@/components/admin-login"
import { AdminDashboard } from "@/components/admin-dashboard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="bg-primary-color rounded-full p-2 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-white"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-color to-accent-color bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <Link href="/">
            <Button
              variant="outline"
              className="border-primary-color text-primary-color hover:bg-primary-color hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại Chat
            </Button>
          </Link>
        </header>

        {isAuthenticated ? <AdminDashboard /> : <AdminLogin onLogin={handleLogin} />}
      </div>
    </main>
  )
}


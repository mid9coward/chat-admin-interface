import { ChatInterface } from "@/components/chat-interface"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogIn } from "lucide-react"

export default function Home() {
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
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-color to-accent-color bg-clip-text text-transparent">
              AI Assistant
            </h1>
          </div>
          <Link href="/admin">
            <Button
              variant="outline"
              className="border-primary-color text-primary-color hover:bg-primary-color hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Admin Login
            </Button>
          </Link>
        </header>
        <ChatInterface />
      </div>
    </main>
  )
}


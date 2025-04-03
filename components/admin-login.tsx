"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Lock, User, LogIn } from "lucide-react"
import { motion } from "framer-motion"

interface AdminLoginProps {
  onLogin: (success: boolean) => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication
    setTimeout(() => {
      if (username === "admin" && password === "password") {
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn đến với trang quản trị",
          variant: "default",
        })
        onLogin(true)
      } else {
        toast({
          title: "Đăng nhập thất bại",
          description: "Tên đăng nhập hoặc mật khẩu không đúng",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary-color/20 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-color to-primary-color/80 p-6">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full">
                <Lock className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-center text-white text-2xl">Đăng nhập quản trị</CardTitle>
            <p className="text-center text-white/80 mt-2">Nhập thông tin đăng nhập để tiếp tục</p>
          </div>
          <CardContent className="p-6 pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Tên đăng nhập
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="pl-10 border-primary-color/30 focus-visible:ring-primary-color py-6"
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 border-primary-color/30 focus-visible:ring-primary-color py-6"
                    placeholder="Nhập mật khẩu"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-primary-color hover:bg-primary-color/90 py-6 text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang xử lý
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Đăng nhập
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}


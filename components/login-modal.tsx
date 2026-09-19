"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, User, Lock, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import PhoneInput from "@/components/phone-input"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: (user: { name: string; email: string; firstName: string; lastName: string }) => void
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // Login logic
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        })

        if (response.ok) {
          const data = await response.json()
          onLoginSuccess({
            name: data.data.firstName ? `${data.data.firstName} ${data.data.lastName}`.trim() : data.data.email.split('@')[0],
            email: data.data.email,
            firstName: data.data.firstName || '',
            lastName: data.data.lastName || ''
          })
          onClose()
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          })
        } else {
          const error = await response.json()
          toast({
            title: "Login Failed",
            description: error.error || error.message || "Invalid email or password",
            variant: "destructive"
          })
        }
      } else {
        // Register logic
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password Mismatch",
            description: "Passwords do not match",
            variant: "destructive"
          })
          setLoading(false)
          return
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
          })
        })

        if (response.ok) {
          const data = await response.json()
          onLoginSuccess({
            name: `${data.data.firstName} ${data.data.lastName}`.trim(),
            email: data.data.email,
            firstName: data.data.firstName,
            lastName: data.data.lastName
          })
          onClose()
          toast({
            title: "Account Created!",
            description: "Welcome to COSMORA!",
          })
        } else {
          const error = await response.json()
          toast({
            title: "Registration Failed",
            description: error.error || error.message || "Failed to create account",
            variant: "destructive"
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: ""
    })
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 md:top-4 right-3 md:right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            {isLogin ? "Sign in to your account" : "Join COSMORA today"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {!isLogin && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs md:text-sm font-medium text-gray-700">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="pl-8 md:pl-10 text-sm md:text-base"
                      required={!isLogin}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs md:text-sm font-medium text-gray-700">
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="pl-8 md:pl-10 text-sm md:text-base"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs md:text-sm font-medium text-gray-700">
                  Mobile Number
                </Label>
                <PhoneInput
                  id="phone"
                  value={formData.phone}
                  onChange={(full) => setFormData((prev) => ({ ...prev, phone: full }))}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs md:text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-8 md:pl-10 text-sm md:text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs md:text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-8 md:pl-10 text-sm md:text-base"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs md:text-sm font-medium text-gray-700">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-8 md:pl-10 text-sm md:text-base"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#2F3F8F] hover:bg-[#1B2A4A] text-white font-medium py-2 md:py-3 rounded-lg transition-all duration-200 text-sm md:text-base"
            disabled={loading}
          >
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center mt-4 md:mt-6">
          <p className="text-gray-600 text-xs md:text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={toggleMode}
              className="ml-1 text-[#2F3F8F] hover:text-[#1B2A4A] font-medium transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

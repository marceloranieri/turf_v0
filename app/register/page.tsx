"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ParticleBackground } from "@/components/particle-background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, X, Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

export default function Register() {
  const { signUp } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    username: "",
    fullName: "",
  })
  const [interests, setInterests] = useState<string[]>([])

  // Options for the interests selector
  const interestOptions = [
    "Technology",
    "Gaming",
    "Music",
    "Design",
    "Art",
    "Books",
    "Movies",
    "Sports",
    "Travel",
    "Fashion",
    "Science",
    "Photography",
  ]

  // Check username availability
  const checkUsername = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null)
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("profiles").select("username").eq("username", username).maybeSingle()

      if (error) throw error
      setUsernameAvailable(!data)
    } catch (error) {
      console.error("Error checking username:", error)
      toast({
        title: "Error",
        description: "Failed to check username availability",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate password strength
  const getPasswordStrength = (password: string) => {
    if (!password) return 0

    let strength = 0

    // Length check
    if (password.length >= 8) strength += 1

    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const getPasswordStrengthLabel = () => {
    if (!formData.password) return ""
    if (passwordStrength === 1) return "Weak"
    if (passwordStrength === 2) return "Fair"
    if (passwordStrength === 3) return "Good"
    if (passwordStrength === 4) return "Strong"
    return ""
  }

  const getPasswordStrengthColor = () => {
    if (!formData.password) return "bg-zinc-700"
    if (passwordStrength === 1) return "bg-red-500"
    if (passwordStrength === 2) return "bg-orange-500"
    if (passwordStrength === 3) return "bg-yellow-500"
    if (passwordStrength === 4) return "bg-green-500"
    return "bg-zinc-700"
  }

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "firstName":
        return !value ? "First name is required" : undefined
      case "lastName":
        return !value ? "Last name is required" : undefined
      case "email":
        if (!value) return "Email is required"
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format"
        return undefined
      case "phone":
        if (!value) return "Phone number is required"
        if (value.length < 10) return "Phone number must be at least 10 digits"
        return undefined
      case "password":
        if (!value) return "Password is required"
        if (value.length < 8) return "Password must be at least 8 characters"
        return undefined
      case "confirmPassword":
        if (!value) return "Please confirm your password"
        if (value !== formData.password) return "Passwords do not match"
        return undefined
      default:
        return undefined
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (name === "username") {
      checkUsername(value)
    }

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    // Validate all required fields
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) {
        newErrors[key as keyof FormErrors] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  // Toggle interest selection
  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((item) => item !== interest))
    } else {
      setInterests([...interests, interest])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check all required fields",
        variant: "destructive",
      })
      return
    }

    if (!usernameAvailable) {
      toast({
        title: "Error",
        description: "Username is not available",
        variant: "destructive",
      })
      return
    }

    if (passwordStrength < 3) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await signUp(formData.email, formData.password, {
        username: formData.username,
        fullName: formData.fullName,
        interests,
      })

      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      })

      router.push("/check-email")
    } catch (error: any) {
      console.error("Error signing up:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      })
      if (error) throw error
    } catch (error) {
      toast({ title: "Error", description: "Google sign-in failed", variant: "destructive" })
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-black text-white">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Create an account</h1>
            <p className="text-zinc-400 text-sm leading-snug">
              Rediscover social with Turf: Fresh daily topics to spark your wit and meet your kind of people.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input 
                name="firstName" 
                placeholder="First name" 
                required 
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 transition-all duration-200 ease-in-out ${
                  errors.firstName ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-yellow-400"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1 transition-all duration-200 ease-in-out">
                  {errors.firstName}
                </p>
              )}
            </div>
            <div className="flex-1">
              <Input 
                name="lastName" 
                placeholder="Last name" 
                required 
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 transition-all duration-200 ease-in-out ${
                  errors.lastName ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-yellow-400"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1 transition-all duration-200 ease-in-out">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>
          <Input 
            type="email" 
            name="email" 
            placeholder="Email" 
            required 
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 transition-all duration-200 ease-in-out ${
              errors.email ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-yellow-400"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 transition-all duration-200 ease-in-out">
              {errors.email}
            </p>
          )}
          <Input 
            type="tel" 
            name="phone" 
            placeholder="Phone Number" 
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 transition-all duration-200 ease-in-out ${
              errors.phone ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-yellow-400"
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1 transition-all duration-200 ease-in-out">
              {errors.phone}
            </p>
          )}

          <div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`pr-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 transition-all duration-200 ease-in-out ${
                  errors.password ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-yellow-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-all duration-200 ease-in-out"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 transition-all duration-200 ease-in-out">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 transition-all duration-200 ease-in-out ${
                errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-yellow-400"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1 transition-all duration-200 ease-in-out">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-yellow-400 text-black hover:bg-yellow-300 transition-all duration-200 ease-in-out transform hover:scale-[1.02]" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Sign Up'}
          </Button>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full border-zinc-800 hover:bg-zinc-800/50 transition-all duration-200 ease-in-out transform hover:scale-[1.02]" 
            onClick={handleGoogleSignIn}
          >
            Sign In with Google
          </Button>

          <p className="text-center text-sm text-zinc-400">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-yellow-400 hover:text-yellow-300 transition-all duration-200 ease-in-out"
            >
              Login
            </Link>
          </p>
        </form>
      </div>

      <div 
        className="hidden md:flex flex-1 bg-cover bg-center items-center justify-center p-8 relative"
        style={{ backgroundImage: 'url("/turf-signup-visual.jpg")' }}
      >
        <div className="absolute inset-0 bg-black/30 transition-all duration-200 ease-in-out" />
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl p-6 text-left shadow-lg max-w-sm relative z-10 transition-all duration-200 ease-in-out hover:scale-[1.02]">
          <p className="text-sm text-zinc-300 mb-2">Join Your Crowd</p>
          <p className="text-lg font-semibold">
            Where shared interests spark fresh chats — and new friends, daily!
          </p>
        </div>
      </div>
    </div>
  )
}

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

export default function Register() {
  const { signUp } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
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

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (name === "username") {
      checkUsername(value)
    }
  }

  // Toggle interest selection
  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((item) => item !== interest))
    } else {
      setInterests([...interests, interest])
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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

      router.push("/dashboard")
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

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black p-4">
      <ParticleBackground />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-10"></div>

      <div className="w-full max-w-md z-20">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center mb-2">
            <span className="text-xl font-bold text-white">T</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Turf</h1>
        </div>

        {/* Form Container */}
        <div className="backdrop-blur-sm bg-zinc-900/80 border border-zinc-800/50 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-2">Let's get you set up</h2>
          <p className="text-zinc-400 mb-6">Create an account to join daily conversations</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name field */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Full Name</label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="bg-zinc-800/80 border-zinc-700/50 rounded-lg focus-visible:ring-violet-500"
                placeholder="Your full name"
                required
              />
            </div>

            {/* Username field */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Username</label>
              <div className="relative">
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-zinc-800/80 border-zinc-700/50 rounded-lg focus-visible:ring-violet-500 pr-10"
                  placeholder="Choose a unique username"
                  required
                />
                {isLoading && formData.username && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-5 w-5 text-zinc-400 animate-spin" />
                  </div>
                )}
                {usernameAvailable === true && !isLoading && formData.username && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                )}
                {usernameAvailable === false && !isLoading && formData.username && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <X className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {usernameAvailable === false && !isLoading && formData.username && (
                <p className="text-sm text-red-500 mt-1">This username is already taken</p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-zinc-800/80 border-zinc-700/50 rounded-lg focus-visible:ring-violet-500"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-zinc-800/80 border-zinc-700/50 rounded-lg focus-visible:ring-violet-500 pr-10"
                  placeholder="Create a secure password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-zinc-400">Strength: {getPasswordStrengthLabel()}</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Interests selector */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">What are you into?</label>
              <p className="text-xs text-zinc-500 mb-3">Pick a few to help us find your kind of conversations</p>

              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <Badge
                    key={interest}
                    variant={interests.includes(interest) ? "default" : "outline"}
                    className={`
                      cursor-pointer transition-all text-sm py-1.5 px-3
                      ${
                        interests.includes(interest)
                          ? "bg-violet-600 hover:bg-violet-700 border-transparent"
                          : "bg-zinc-800/50 hover:bg-zinc-800 border-zinc-700/50 text-zinc-300"
                      }
                    `}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sign up button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-6 rounded-lg transition-all hover:scale-[1.02] mt-6"
              disabled={isLoading || usernameAvailable === false}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create your account"
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span>
              </div>
            </div>

            {/* Google sign up */}
            <Button
              type="button"
              variant="outline"
              className="w-full bg-zinc-800/80 border-zinc-700/50 text-white hover:bg-zinc-800 py-6 rounded-lg"
              onClick={async () => {
                try {
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                      redirectTo: `${window.location.origin}/auth/callback`,
                    },
                  })
                  if (error) throw error
                } catch (error) {
                  console.error("Error signing in with Google:", error)
                  toast({
                    title: "Error",
                    description: "Failed to sign in with Google",
                    variant: "destructive",
                  })
                }
              }}
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </Button>
          </form>

          {/* Sign in link */}
          <div className="text-center mt-6">
            <p className="text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* User count and avatars */}
        <div className="flex items-center justify-center mt-8">
          <div className="flex -space-x-2 mr-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Avatar key={i} className="border-2 border-black h-8 w-8">
                <AvatarImage src={`/placeholder-icon.png?height=32&width=32&text=${i}`} />
                <AvatarFallback className="bg-zinc-800">{i}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-sm text-zinc-400">Join over 20K explorers in daily conversations</span>
        </div>
      </div>
    </div>
  )
}

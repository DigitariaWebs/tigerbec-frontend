"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox" 
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { membersApi } from "@/lib/api"
import { toast } from "sonner"

export function SignupForm3({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    phone: "",
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!acceptedTerms) {
      toast.error('Please accept the Terms of Service and Privacy Policy')
      return
    }

    if (!formData.name || !formData.email || !formData.password || !formData.dateOfBirth) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      setIsLoading(true)
      
      const result = await membersApi.signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone || undefined,
      })

      console.log('Sign up successful:', result)
      toast.success('Account created successfully!')
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account'
      toast.error(errorMessage)
      console.error('Sign up error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex justify-center mb-2">
                <Link href="/" className="flex items-center gap-2 font-medium">
                  <div className="  flex  items-center justify-center rounded-md">
                     <Image 
                     src="https://xqqbnlsmqrgwgscuigwi.supabase.co/storage/v1/object/sign/platform%20images/Logo.avif?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kMmM4MjVjNi1lN2E0LTQ3NTktYTU3ZS1lMTgzZGZmMWRlNjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGF0Zm9ybSBpbWFnZXMvTG9nby5hdmlmIiwiaWF0IjoxNzY3NjYxOTY1LCJleHAiOjIwODMwMjE5NjV9.jUvcTAjonyLEPTrf8-QNfVxeNOLeHHw3CNjieuyrU7o"
                      alt="TCTPro Logo"
                      width={75}
                      height={75}
                     />
                  </div> 
                </Link>
              </div>
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your information to create a new account
                </p>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password *</Label>
                <Input 
                  id="password" 
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required 
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required 
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="underline underline-offset-4 hover:text-primary">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline underline-offset-4 hover:text-primary">
                    Privacy Policy
                  </a>
                </Label>
              </div>

              <Button type="submit" className="w-full cursor-pointer" disabled={isLoading || !acceptedTerms}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
              
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/sign-in" className="underline underline-offset-4">
                  Sign in
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="https://xqqbnlsmqrgwgscuigwi.supabase.co/storage/v1/object/sign/platform%20images/bg.avif?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kMmM4MjVjNi1lN2E0LTQ3NTktYTU3ZS1lMTgzZGZmMWRlNjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGF0Zm9ybSBpbWFnZXMvYmcuYXZpZiIsImlhdCI6MTc2NzY2MTcyNiwiZXhwIjoyMDgzMDIxNzI2fQ.Rj8wT5CvmpSasanK03-NvrotGOH-UW39Sk1yc31v30k"
              alt="Image"
              fill
              className="object-cover dark:brightness-[0.95]  *:"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}

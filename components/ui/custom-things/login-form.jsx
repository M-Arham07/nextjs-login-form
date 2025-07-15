  "use client"

  import { zodResolver } from "@hookform/resolvers/zod"
  import { useForm } from "react-hook-form"
  import { z } from "zod"
  import { useState } from "react"
  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Separator } from "@/components/ui/separator"
  import { Github } from "lucide-react"
  import LoadingDialog from "./loading-dialog"
  import LoginAlert from "./login-success-alert"
  import Link from "next/link"

  // Google Icon Component
  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
  )

  const EyeOpenIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        d="M1 12C2.73 7.61 7.09 4.5 12 4.5c4.91 0 9.27 3.11 11 7.5-1.73 4.39-6.09 7.5-11 7.5-4.91 0-9.27-3.11-11-7.5z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" />
    </svg>
  )

  const EyeClosedIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        d="M1 12C2.73 7.61 7.09 4.5 12 4.5c4.91 0 9.27 3.11 11 7.5-1.73 4.39-6.09 7.5-11 7.5-4.91 0-9.27-3.11-11-7.5z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" />
      <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
    </svg>
  )

  const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })

  export default function LoginForm({
    onSubmit,
    customError,
    inProgress,
    ShowSuccess,
    onGoogleSignIn,
    onGithubSignIn,
  }) {
    const [PShow, setPShow] = useState(false)

    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    })

    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 pb-39">
        <LoadingDialog inProgress={inProgress} />
        <LoginAlert isOpen={ShowSuccess} />

        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">Sign in to your account to continue</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-1/2 h-11 text-sm font-medium hover:bg-gray-50 transition-colors bg-transparent flex items-center justify-center"
                onClick={onGoogleSignIn}
                type="button"
              >
                <GoogleIcon />
                <span className="ml-2 hidden sm:inline">Google</span>
              </Button>
              <Button
                variant="outline"
                className="w-1/2 h-11 text-sm font-medium hover:bg-gray-50 transition-colors bg-transparent flex items-center justify-center"
                onClick={onGithubSignIn}
                type="button"
              >
                <Github className="w-4 h-4" />
                <span className="ml-2 hidden sm:inline">GitHub</span>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {customError && (
                <div className="text-destructive text-sm text-center p-2 bg-destructive/10 rounded-md">{customError}</div>
              )}

              {form.formState.errors.email && (
                <div className="text-destructive text-sm">{form.formState.errors.email.message}</div>
              )}

              {form.formState.errors.password && !form.formState.errors.email && (
                <div className="text-destructive text-sm">{form.formState.errors.password.message}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" className="h-11" {...form.register("email")} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/change-password" className="text-sm text-primary hover:underline focus:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={PShow ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-11 pr-10"
                    {...form.register("password")}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      setPShow(!PShow)
                    }}
                    type="button"
                  >
                    {PShow ? EyeClosedIcon : EyeOpenIcon}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 font-medium" disabled={inProgress}>
                {inProgress ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

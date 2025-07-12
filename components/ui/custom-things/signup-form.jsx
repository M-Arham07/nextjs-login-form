"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link  from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LoadingDialog from "./loading-dialog"

// EYE OPEN CLOSE ICONS:

const EyeOpenIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M1 12C2.73 7.61 7.09 4.5 12 4.5c4.91 0 9.27 3.11 11 7.5-1.73 4.39-6.09 7.5-11 7.5-4.91 0-9.27-3.11-11-7.5z" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" />
  </svg>
);

const EyeClosedIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M1 12C2.73 7.61 7.09 4.5 12 4.5c4.91 0 9.27 3.11 11 7.5-1.73 4.39-6.09 7.5-11 7.5-4.91 0-9.27-3.11-11-7.5z" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" />
    <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
  </svg>
);





const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Confirm Password must be at least 8 characters.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});




  

export default function SignupForm({onSubmit, customError,inProgress}) {


    // THE PARENT COMPONNET WILL PASS a function as props to onsubmit, like <SignupForm onSubmit={fn} />
   

    // USESTATES:
    const [PShow, setPShow] = useState(false);


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });




    
    










    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-2 pb-25 sm:pb-0">
            <LoadingDialog inProgress={inProgress} />
            <Card className="w-full max-w-90 sm:max-w-sm mx-auto shadow-lg rounded-lg">
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                        Enter your details below to sign up
                    </CardDescription>
                    <CardAction>
                        <Link href='/login'>
                        <Button variant="link">Login</Button></Link>
                        
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            {/* Show custom error above the email field */}
                            {customError && (
                                <span className="text-destructive text-sm mb-2">{customError}</span>
                            )}
                            {/* Show error message above the email field */}
                            {form.formState.errors.email && (
                                <span className="text-destructive text-sm mb-2">{form.formState.errors.email.message}</span>
                            )}
                            {form.formState.errors.password && !form.formState.errors.email && (
                                <span className="text-destructive text-sm mb-2">{form.formState.errors.password.message}</span>
                            )}
                            {form.formState.errors.confirmPassword && !form.formState.errors.email && !form.formState.errors.password && (
                                <span className="text-destructive text-sm mb-2">{form.formState.errors.confirmPassword.message}</span>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    {...form.register("email")}
                                />
                            </div>
                            <div className="grid gap-2 relative">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type={PShow ? 'text' : 'password'}
                                    required
                                    placeholder="Password"
                                    {...form.register("password")}
                                />
                                <button
                                    className="absolute right-3 top-8 text-muted-foreground"
                                    onClick={(e) =>  { e.preventDefault(); setPShow(!PShow) }}
                                >
                                    {PShow ? EyeClosedIcon : EyeOpenIcon}
                                </button>
                            </div>
                            <div className="grid gap-2 relative">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type={PShow ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    {...form.register("confirmPassword")}
                                />

                                <button
                                    className="absolute right-3 top-8 text-muted-foreground"
                                    onClick={(e) =>  { e.preventDefault(); setPShow(!PShow) }}
                                >
                                    {PShow ? EyeClosedIcon : EyeOpenIcon}
                                </button>
                            </div>
                            <Button type="submit" className="w-full mt-4">
                                Sign Up
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
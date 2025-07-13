
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation";
import ChangePassAlert from "./change-pass-success"

import {  
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

// Zod schema for OTP input, new password, and confirm password
const FormSchema = z.object({
  pin: z.string()
    .min(6, { message: "Your one-time password must be 6 digits." })
    .max(6, { message: "Your one-time password must be 6 digits." })
    .regex(/^\d+$/, { message: "OTP must contain only numbers." }),
  newPassword: z.string()
    .min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import LoadingDialog from "./loading-dialog"


export default function OTP_FORM({token}) {
  const router=useRouter();
  // console.log(token);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

 const { setError } = form;

 // ALERT DIALOG:
 const [isOpen,setOpen]=useState(false);
 // LOADING:
 const [inProgress,setInProgress]=useState(false);

async function onSubmit({pin:otp,newPassword}) {
// console.log(otp)

  try{
    setInProgress(true);
    const res= await fetch('/api/change-password/step2',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        otp:otp,
        password:newPassword
      })
    });
    const data=await res.json();

    if(!res.ok){
      setInProgress(false);
       setError("pin", { type: "manual", message: data.errmsg || "Server Down! Please try again later"});
       return;
    }

    // if program has reached here, it means res is OK(200)

    // remove loading dialog and show CHANGE PASSWORD SUCCESS ALERT
    setInProgress(false);

    //Change password success aleert:
    setOpen(true);

    // REDIRECT TO LOGIN PAGE AFTER 2.5 SEC
    setTimeout(()=>router.replace('/login'),2500);
    return;


  }


  catch(err){
    console.error(err);
    setError("pin", { type: "manual", message: data?.errmsg || "Server Down! Please try again later"});
    return;
  }

  
  }

  


  return (
    
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm grid-rows-4 shadow-lg">
       {/* LOADING: */} 
       <LoadingDialog inProgress={inProgress} />
        {/* CHANGEPASS SUCCESS ALERT */}
        <ChangePassAlert isOpen={isOpen} />
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Enter the one-time password sent to your email or phone to continue
          </CardDescription>
          <CardAction>
            <Button variant="link"><Link href="/login">Back to Login</Link></Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} inputtype="number" {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the one-time password (OTP) sent to your phone.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="Enter new password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your new password (at least 8 characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="Re-enter new password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Re-enter your new password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Submit</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  );


}

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { redirect, useRouter } from "next/navigation";

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

// Zod schema for OTP input only
const FormSchema = z.object({
  pin: z.string()
    .min(6, { message: "Your one-time password must be 6 digits." })
    .max(6, { message: "Your one-time password must be 6 digits." })
    .regex(/^\d+$/, { message: "OTP must contain only numbers." })
});

import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import AlertDialog from "@/components/ui/custom-things/signup-sucess-alert"


export default function OTP_FORM({token}) {
 
  const router=useRouter();
  // console.log(token);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  const { setError } = form;
   

  //ALERT SUCCESS DIALOG:
  const [isOpen, setOpen] = useState(false);

  async function onSubmit(info) {
    console.log(token)
    try {
      const { pin } = info;
      const res = await fetch('/api/signup/step2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          otp: pin
        })
      });

      const data=await res.json();

      if(!res.ok){ // if response isnt OK(200), throw the errmsg object received to catch block. From there it will be setted
        throw new Error(data.errmsg);
      }
      // AS RESPONSE OK, NOW SHOW ALERT DIALOG SAYING ACC CREATED AND THEN REDIRECT TO LOGIN (after 2.5s)
      setOpen(true)
      setTimeout(()=>router.replace('/login'),2500);
      return;



    } catch (err) { // setError to err.message, which contains errmsg sent from backend!
      console.log(err.message);
      setError("pin", { type: "manual", message: err.message || "Server down! Please try again later." });
      // refresh page after 2.5 seconds so it goes back to signup page!
      setTimeout(()=>router.refresh(),2500)
      return;
      
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm grid-rows-4 shadow-lg">
        <AlertDialog isOpen={isOpen} />
        <CardHeader>
          <CardTitle>Verify OTP</CardTitle>
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
              <Button type="submit" className="w-full">Submit</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  );


}

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const FormSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
})



import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react"
import ChangePassForm from "@/components/ui/custom-things/change-pass-form"
import LoadingDialog from "@/components/ui/custom-things/loading-dialog"

export default function CHANGE_PASSWORD() {
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
        },
    })

     // USE STATES:
    const [InputFormShow, setInputFormShow] = useState(true)
    const [inProgress,setInProgress]=useState(false)


    // INPUT EMAIL FORM!:
    const INPUT_EMAIL_FORM =
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <LoadingDialog inProgress={inProgress}/>
            <Card className="w-full max-w-sm grid-rows-4 shadow-lg">
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                        Enter your email to receive a password reset link
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
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="you@example.com" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            We'll never share your email.
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



   





    // For custom error
    const { setError } = form;

    async function onSubmit({ email }) {
        // setError("email", { type: "manual", message: "This email is blocked. Please use another email." });
        

        try{
            setInProgress(true);
        const res= await fetch('/api/change-password/step1',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({email:email})
        });
        const data=await res.json();

        if(!res.ok){
            setInProgress(false);
            setError("email", { type: "manual", message:data?.errmsg || "Server Down! Please try again later."  });
            return;
        }

        // here the response should be OK(200)
        setInProgress(false);
        

        // hide the input form and show ChangePassform
        setInputFormShow(false);
        return true;

        





    }
    catch(err){
        console.error(err)
        setInProgress(false);
         setError("email", { type: "manual",message: "Server Down! Please try again later."  });
         return;

    }





    }

    return InputFormShow ? INPUT_EMAIL_FORM : <ChangePassForm  /> 
}

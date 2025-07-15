"use client";
import { useState } from "react";
import LoginForm from "@/components/ui/custom-things/login-form"
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LOGIN() {
    const router = useRouter()

    // SUCCESS DIALOG:
    const [Success, setSuccess] = useState(false);

    const [errmsg, setErrmsg] = useState("");
    const [inProgress, setInProgress] = useState(false);

    async function handleLogin({ email, password }) {
        // prevent defualt is done automatically in react hook form

        // CRENDTIAL LOGIN NEXT_AUTH:
        setInProgress(true);

        const res = await signIn('credentials', {
            email: email,
            password: password,
            redirect: false // dont automatically redirect after executing signIn!
        });

        if (!res.ok) {
            setInProgress(false);
            setErrmsg(res.error);
            return;

        }

        // as response is ok if it has passed above check, so do this!
        setInProgress(false);
        setSuccess(true); //show success alert!
        setTimeout(() => router.replace('/'), 2000) // GO TO HOME PAGE AFTER TWO SECONDS!
        return true;




    }

    return (
        <LoginForm onSubmit={handleLogin}
            customError={errmsg}
            inProgress={inProgress}
            ShowSuccess={Success}
            onGithubSignIn={() => signIn('github', { callbackUrl: '/' })}
            onGoogleSignIn={() => signIn('google', { callbackUrl: '/' })} />
    );

}
"use client";
import { SessionProvider } from "next-auth/react";

export default function SESSION_PROVIDER({children}){
    return <SessionProvider>{children}</SessionProvider>
}
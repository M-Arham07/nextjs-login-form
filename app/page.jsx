
"use client";
import { Button } from "@/components/ui/button";

import { signOut, useSession } from "next-auth/react";



export default function HOME() {
  const { data: session, status } = useSession();

  function handleSignout() {
    signOut({ callbackUrl: '/login' })
  }

  console.log(session);

  if (status === 'loading'){
    return <h1>Loading.........</h1>
  }

    if (session) {
      return (<>
        <h1>HELLO {session.user.name}! Your email is {session.user.email}.</h1>
        <Button onClick={handleSignout}> CLICK HERE TO SIGNOUT </Button>
      </>)
    }

  return (<h1>YOU ARENT LOGGED IN!</h1>)


}

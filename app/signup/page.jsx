"use client";
import OTP_FORM from "@/components/ui/custom-things/otp-form";
import SignupForm from "@/components/ui/custom-things/signup-form";
import { useEffect, useState } from "react";

export default function SIGN_UP() {

  const [errmsg, setErrmsg] = useState("");




  const [token, setToken] = useState(null);
  const [otpform, setotpForm] = useState(false);
  const [inProgress,setInProgress]=useState(false);

  async function HandleSignup(values) {
    
    

    // prevent defualt is done by defualt!
    try {
      setInProgress(true); // SHOW LOADING DIALOG!
      

      const { email, password } = values; //console.log(email,password)

      const res = await fetch('/api/signup/step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password

        })
      });
      const data = await res.json();

      if (!res.ok) { // if response isnt OK (200), set the custom error to data.errmsg, which will be passed as props to signup form
        setInProgress(false);
        setErrmsg(data.errmsg)
        return;

      }

      const { token } = data;
      setToken(token);
      // remove loading dialog:
      setInProgress(false)
      // show OTP FORM NOW!
      setotpForm(true);
      
      return true;
    }
    catch (err) {
      setInProgress(false);
      console.error(err);
      setErrmsg("Server Down! Please try again later.")
      return;
    }


  }


  // if otpform= true, show it otherwise signup form


  return otpform ? <OTP_FORM token={token} /> : <SignupForm onSubmit={HandleSignup} customError={errmsg} inProgress={inProgress} />
}
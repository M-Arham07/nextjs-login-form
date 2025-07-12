"use client";
import { useState } from "react";
import LoginForm from "@/components/ui/custom-things/login-form"
import { useRouter } from 'next/navigation';

export default function LOGIN(){        
    const router=useRouter()

    // SUCCESS DIALOG:
const [Success,setSuccess]=useState(false);

const [errmsg, setErrmsg] = useState("");
const [inProgress,setInProgress]=useState(false);

async function handleLogin(values){
    try{
        setInProgress(true);
        const {email,password}=values;
        const res= await fetch('/api/login',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                email:email,
                password:password
            })

        });

        const data= await res.json();
        if(!res.ok){
            setInProgress(false);
            setErrmsg(data?.errmsg);
            return;
        }

        // AS RESPONSE OK, NOW DO THIS:
        setInProgress(false);
        setSuccess(true);
        // GO TO HOME AFTER 2  SECONDS IF LOGIN SUCCESS!
        setTimeout(()=>router.replace('/'),2000)
        return;
    
        


    }
    catch(err){
        
    }
    
}

return(
<LoginForm onSubmit={handleLogin} customError={errmsg} inProgress={inProgress} ShowSuccess={Success}/>
);
    
}
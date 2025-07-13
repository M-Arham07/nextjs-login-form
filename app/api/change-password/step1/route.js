import ConnectDB from "@/server-actions/ConnectDB";
import User from "@/server-actions/models/User";
import SEND_OTP from "@/server-actions/SEND_OTP";
import { NextResponse } from "next/server";

export async function POST(request){
    try{
    let {email}= await request.json();
    email=email.trim().toLowerCase();

    const isExist= await User.findOne({email:email});
    
    if(!isExist){
        throw new Error("No user with this email was found!")
    }

    await SEND_OTP(email);

    const response=NextResponse.json({msg:"OTP SENT SUCCESSFULLY!"},{status:200});
    response.cookies.set("email",email,{
        path:'/api/change-password',
        sameSite:'strict',
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        maxAge:600 
    });

    console.log("SET COOKIES FOR ",email)
    return response;


    }

    catch(err){
        console.error(err); 
        return NextResponse.json({errmsg:err.message},{status:400})

    }
}
import ConnectDB from "@/server-actions/ConnectDB";
import { cookies } from "next/headers";
import OTP from '@/server-actions/models/otpModel';
import User from '@/server-actions/models/User';
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { NextResponse } from "next/server";



export async function POST(request) {
    try {
        const { otp, password } = await request.json();
        if (!otp || !password) {
            throw new Error("Please fill in all the fields!");
        }
        await ConnectDB();
        const cookieStore= await cookies();
        const email=cookieStore.get("email")?.value; //console.log(email)
       
        if(!email){ // if email doesent exist in cookies or is expired
            throw new Error("Session expired! Please request a new otp.");
        }

        const found=await OTP.findOne({email:email});

        // if the email isnt found in OTP collection it means OTP EXPIRED

        if(!found){
              throw new Error("Session expired! Please request a new otp.");
        }

        // if program has passed all above checks, it means otp should exist in the collection OTPs
        // so lets compare 

        if(found.otp !== otp){
            throw new Error("The OTP you entered is not correct!")
        }

        // if above checked is passed, it means found.otp === otp (means user gave correct otp)
        // NOW LETS HASH AND UPDATE HIS PASSWORD!
        const hashedPass=await bcrypt.hash(password,10);

        await User.findOneAndUpdate({email:email},{$set:{password:hashedPass}});

        // user updated without errors, now return with status 200
        return NextResponse.json({msg:"Password changed successfully"},{status:200});
    }

    // ERROR HANDLING:

    catch (err) {
        console.error(err)
        if(err.message.includes("Please fill in all the fields!")){
            return NextResponse.json({errmsg:err.message},{status:400})
        }
        if(err.message.includes("Session expired! Please request a new otp.")){
            return NextResponse.json({errmsg:err.message},{status:400})
        }
        if(err.message.includes("The OTP you entered is not correct!")){
             return NextResponse.json({errmsg:err.message},{status:400})
        }
        return NextResponse.json({errmsg:"Server Down! Please try again later."},{status:500});

    }

}
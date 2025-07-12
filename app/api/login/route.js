import User from "@/server-actions/models/User"
import ConnectDB from "@/server-actions/ConnectDB";
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function POST(request){
    try{

    let {email,password}= await request.json();
    email=email.trim().toLowerCase();


    if(!email || !password){
        throw new Error("Please fill all fields!");
    }

    await ConnectDB();

    // AS EMAIL AND PASSWORD EXIST, NOW LETS FIND IF EMAIL EXISTS OR NOT

    const found = await User.findOne({email:email});

    if(!found){
        throw new Error("No user with the entered email was found!")
    }


    /* THE USER SHOULD BE found if it has passed above check, now lets compare entered password
     and password stored in the db using bcrypt.compare */

     const isMatch= await bcrypt.compare(password,found.password);

     if(!isMatch){ // if the password doesent match, do this:
        throw new Error("Incorrect Password!");
     }

     // IF THE PROGRAM REACHES HERE, IT MEANS PASSWORD IS CORRECT (isMatch = true)
     // SO NOW LET'S SEND A RESPONSE!
     // TODO: ADD SOME TYPE OF JWT AUTH 


     // GENERATE A SECURE HTTP COOKIE AND SEND IT WITH JWT TOKEN THAT INCLUDES USER ID (OBJECT ID), CAN ALSO USE EMAIL!
     const PAYLOAD= {id: found._id}
     const token=jwt.sign(PAYLOAD,process.env.SECRET,{expiresIn:'1d'});

    const response= NextResponse.json({msg:"Login Success!"},{status:200});
    response.cookies.set('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production', // IN PRODCUTION, WE USE secure true so it ensures that cookie only sent over HTTPS
        sameSite:'strict', // PREVENTS CSRF ATTACKS 
        path:'/', // MEANS COOKIE IS VALID FOR WHOLE SITE, if path was /dashboard, it would only be sent when user visits dashboard
        maxAge:60*60*24 // 1 DAY 
    });
    console.log("RESPONSE SENT:",response);
    return response;

     

 

    }

    // ERROR HANDLING
    catch(err){
        if(err.message.includes("Please fill all fields!")){
            return NextResponse.json({errmsg:err.message},{status:400});
        }
        if(err.message.includes("No user with the entered email was found!")){
            return NextResponse.json({errmsg:err.message},{status:400});
        }
        if(err.message.includes("Incorrect Password!")){
            return NextResponse.json({errmsg:err.message},{status:400});
        }
        return NextResponse.json({errmsg:"Server Down! Please try again later"},{status:500})
        
    }

}

import ConnectDB from "@/server-actions/ConnectDB";
import bcrypt from 'bcrypt';
import User from "@/server-actions/models/User";
import SEND_OTP from "@/server-actions/SEND_OTP";
import jwt from 'jsonwebtoken'
import { NextResponse } from "next/server";


export async function POST(request) {
    try {
        let { email, password } = await request.json();
        email = email.trim().toLowerCase();

        if (!email || !password) {
            return NextResponse.json({ errmsg: "Please fill in all fields!" }, { status: 400 })
        }
        // CONNECT DATABASE
        await ConnectDB();

        // CHECK IF THE USER EXISTS BEFORE!
        const isExist = await User.findOne({ email: email });
        if (isExist) {
            return NextResponse.json({ errmsg: "User already exists! Please try a different email." }, { status: 409 })
        }

        // AS THE USER DOESENT EXIST BEFORE, NOW LET VERIFY THE EMAIL

        // FIRST WE WILL SEND OTP!

        await SEND_OTP(email);
        //  // OTP SENT NOW LETS SIGN JWT AND SEND PAYLOAD
        //  const PAYLOAD= {email:email,password:password}
        //  const token=jwt.sign(PAYLOAD,process.env.SECRET,{expiresIn:'10m'}); console.log(token);

        //NEW FEATURE: ADDED COOKIE INSTEAD OF JWT:

        // OTP SENT! NOW LETS RETURN A COOKIE WITH EMAIL!

        const RESPONSE = NextResponse.json({ msg: "OTP SENT!" }, { status: 200 });

        RESPONSE.cookies.set("email", email, {
            sameSite: 'strict',
            path: '/api/signup',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge:600
        });

        // SECOND COOKIE WITH PASSWORD!, although not reccomended
         RESPONSE.cookies.set("password", password, {
            sameSite: 'strict',
            path: '/api/signup',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge:600
        });
        


        return RESPONSE; // sent status 200 with a cookie having email and pass!



    }
    catch (err) {
        console.error(err);
        if (err.message.toLowerCase().includes("too many otps")) {
            return NextResponse.json({ errmsg: "You have requested too many otps! Please try again in 10 minutes" }, { status: 429 });

        }
        return NextResponse.json({ errmsg: err.message || "Server down! Please try again later." }, { status: 500 });
    }


}
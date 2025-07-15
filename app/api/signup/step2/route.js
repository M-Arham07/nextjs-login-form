
import ConnectDB from "@/server-actions/ConnectDB";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import OTP from '@/server-actions/models/otpModel';
import User from "@/server-actions/models/User";
import GREET from "@/server-actions/Greet";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { email } from "zod";

export async function POST(request) {

    try {
        const { otp } = await request.json();

        // now lets retrieve cookies!



        const cookieStore = await cookies();
        console.log("HERES THE COOKIE STORE:",cookieStore)
        const email = cookieStore.get("email")?.value
        const password = cookieStore.get("password")?.value

        // to be continued! will connect db and verify jwt, extract email from it and send response accordingly!
        if (!otp || !email || !password) {
            throw new Error("Please fill the OTP field!");
        }





        await ConnectDB();
        const found = await OTP.findOne({ email: email });

        if (!found) {
            throw new Error("Session expired! Please try again in 10 minutes.");
        }

        // NEW FEATURE: HASHED OTPS

        // COMPARING HASHED OTP!
        const isMatch = await bcrypt.compare(otp, found.otp)

        if (!isMatch) {
            throw new Error("The OTP you entered is not valid!");

        }

        //if program came here, the entered otp should be equal to stored otp
        // NOW LETS INSERT THE USER!, BUT BEFORE LETS DELETE THE OTP!

        await OTP.deleteOne({ email: email });

        // USER INSERT LOGIC!

        const hashedPass = await bcrypt.hash(password, 10);

        const isInserted = await User.create({ email: email, password: hashedPass });

        if (!isInserted) {
            throw new Error("Server Down!")
        }


        // AT THIS POINT, USER HAS BEEN CREATED SUCCESSFULLY, NOW LETS SEND A WELCOME EMAIL TO USER!

        GREET(email);
        return NextResponse.json({ msg: "Your account has been created successfully!" }, { status: 200 });






    }



    // ERROR HANDLING!

    catch (err) {
        console.error(err)

        if (err.message.includes("Please fill the OTP field!")) {
            return NextResponse.json({ errmsg: err.message }, { status: 400 })
        }


        const jwtErrors = ["TokenExpiredError", "JsonWebTokenError"]
        if (jwtErrors.includes(err.name)) {
            return NextResponse.json({ errmsg: "Session expired! Please request a new OTP." }, { status: 401 });
        }

        if (err.message.includes("The OTP you entered is not valid!")) {
            return NextResponse.json({ errmsg: err.message }, { status: 400 })
        }

        else {
            return NextResponse.json({ errmsg: "Server Down! Please try again later." }, { status: 500 });
        }



    }


}
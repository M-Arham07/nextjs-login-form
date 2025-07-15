
import ConnectDB from './ConnectDB';
import OTP from './models/otpModel';
import nodemailer from 'nodemailer';

// OTP HASHING:
import bcrypt from 'bcrypt';


const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        user: process.env.EM,
        pass: process.env.EPASS

    }
})


export default async function SEND_OTP(EMAIL) {

        try {
            await ConnectDB();

            // CHEKC IF USER HAS REQUESTED OTP BEFORE!

            const hasReq = await OTP.findOne({ email: EMAIL });

            if (hasReq) {
                throw new Error("You have requested too many otps! Please try again in 10 minutes");
            }


            // AS USER HASNT REQUESTED MUCH OTP, NOW WE'LL SEND THE OTP TO EMAIL


            const otp = (Math.floor(Math.random() * 900000) + 100000).toString();

            const $html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Your OTP Code</title><style>body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f9f9f9;color:#333;padding:20px}.container{max-width:600px;background-color:#ffffff;padding:30px;margin:0 auto;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05)}.header{text-align:center;font-size:24px;margin-bottom:20px;color:#4CAF50}.otp-box{font-size:28px;text-align:center;background-color:#f1f1f1;padding:15px;border-radius:6px;font-weight:bold;letter-spacing:4px;margin:20px 0}.footer{font-size:12px;color:#888;text-align:center;margin-top:30px}</style></head><body><div class="container"><div class="header">Your One-Time Password (OTP)</div><p>Hi,</p><p>Use the OTP below to verify your email address. This code is valid for the next <strong>10 minutes</strong>:</p><div class="otp-box">${otp}</div><p>If you didn’t request this, you can safely ignore this email.</p><p>Thanks,</p><div class="footer">Made by M.Arham.<br /> <a href="https://github.com/M-Arham07">github.com/M-Arham07</a></div></div></body></html>`;



            const emailOptions = {
                from: process.env.EM,
                to: EMAIL,
                subject: 'Your Account Verification Code – Valid for 10 Minutes',
                html: $html

            };

            const expiry = new Date(Date.now() + 10 * 60 * 1000);


            /* if theres an error while creating otp, it will automatically throw an erorr that 
             will be catched by catch(err), which will reject the promise */

             // UPDATE: WILL STORE HASHED OTPS!
             const hashedOTP=await bcrypt.hash(otp,10);

            await OTP.create({email:EMAIL,otp:hashedOTP,expiresAt:expiry});
            
            await new Promise((resolve,reject)=>{
                transporter.sendMail(emailOptions,(err,info)=>{
                if(err){
                    console.error(`Failed sending otp" ${err}`)
                   return reject(`Failed sending otp." ${err}`);
                }
                console.log(`OTP SENT SUCCESSFULLY! ${info.response}`);
                return resolve(`OTP SENT SUCCESSFULLY! ${info.response}`);

            })

            });

            // AS EVERYTHING HAS GONE WELL, RETURN TRUE:

            return true;


        }


        catch (err) {
            console.error(err);
            throw err;
        }



}
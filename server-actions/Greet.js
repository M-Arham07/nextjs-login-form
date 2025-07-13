
// THIS FUNCTION SENDS A WELCOME EMAIL AFTER USER HAS BEEN CREATED!

import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        user: process.env.EM,
        pass: process.env.EPASS

    }
})

export default async function GREET(email){

    const year = new Date().getFullYear();
const $html = `<!DOCTYPE html><html lang="en" style="margin: 0; padding: 0;"><head><meta charset="UTF-8" /><title>Welcome to NEXT_LOGIN_FORM</title><meta name="viewport" content="width=device-width, initial-scale=1.0" /><style>body{font-family:Arial,sans-serif;background-color:#f4f6f8;margin:0;padding:0;color:#333}.container{max-width:600px;margin:40px auto;background:#fff;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.05);overflow:hidden}.header{background-color:#4f46e5;color:#fff;padding:24px;text-align:center}.content{padding:32px}.content h1{margin-top:0}.footer{font-size:12px;text-align:center;color:#888;padding:20px}.footer a{color:#4f46e5;text-decoration:none}</style></head><body><div class="container"><div class="header"><h2>👋 Welcome to NEXT_LOGIN_FORM!</h2></div><div class="content"><h1>Hi,</h1><p>Thanks for signing up to <strong>NEXT_LOGIN_FORM</strong>! Your account has been created successfully. 🎉</p><p>You can now explore and use all the features we’ve built just for you.</p><p>If you have any questions, just reply to this email — we’re always happy to help.</p><p>Cheers,<br />The NEXT_LOGIN_FORM Team</p></div><div class="footer">&copy; ${year} NEXT_LOGIN_FORM. All rights reserved.<br />Built with ❤️ by <a href="https://github.com/M-Arham07/" target="_blank">M. Arham</a></div></div></body></html>`;





    const emailOptions={
        from:process.env.EM,
        to:email,
        subject:"✅ You're in! Welcome to NEXT_LOGIN_FORM",
        html: $html
    }

    // it isnt much necessary to send mail, so ill not await it 

    transporter.sendMail(emailOptions,(err,info)=>{
        console.log("WELCOME EMAIL SENT TO",email,info.response);
    });
    return true;



}
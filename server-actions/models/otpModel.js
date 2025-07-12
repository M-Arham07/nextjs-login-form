
import mongoose from "mongoose";
const Schema=mongoose.Schema;

const otpSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    otp:{
        type:String,
        required:true,
    },
    expiresAt:{
        type:Date,
        required:true

    }
},{collection:"otps", timestamps:true});

export default mongoose.models.OTP || mongoose.model("OTP",otpSchema);

import mongoose from "mongoose";
const Schema=mongoose.Schema;

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    
},{collection:'users',timestamps:true});

export default mongoose.models.User || mongoose.model("User",userSchema);


"use server";
import mongoose, { mongo } from "mongoose";

export default async function ConnectDB(){
    
    try{
       await mongoose.connect(process.env.DB_URI);
       console.log("Connected to database successfully!")
       return true;
    }
    catch(err){
        console.error("Error connecting to db",err);
        throw err;
    }



}
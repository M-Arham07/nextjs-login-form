
import { cookies } from "next/headers";
import ConnectDB from "@/server-actions/ConnectDB";
import User from "@/server-actions/models/User";
import mongoose,{Types} from "mongoose";
import jwt from 'jsonwebtoken';
async function WELCOME(){
const cookieStore=await cookies();
const TOKEN=cookieStore.get('token')?.value; // console.log("YOUR TOKEN IS:",TOKEN); 
 if(!TOKEN){
  return;
 }

 await ConnectDB();
 const {id}= jwt.decode(TOKEN) // console.log(decoded)
 const {email}=await User.findOne(new Types.ObjectId(id));
//  console.log(email)
return email;



}

export default async function HOME(){


  return <>
  <h1>HELLO {await WELCOME()}</h1>
  </>
}
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import ConnectDB from "@/server-actions/ConnectDB";
import User from "@/server-actions/models/User";


export const authOptions = {

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async function ({ email, password }) {

                try {
                    email = email.trim().toLowerCase();


                    if (!email || !password) {
                        throw new Error("Please fill all fields!");
                    }

                    await ConnectDB();

                    // AS EMAIL AND PASSWORD EXIST, NOW LETS FIND IF EMAIL EXISTS OR NOT

                    const found = await User.findOne({ email: email });

                    if (!found) {
                        throw new Error("No user with the entered email was found!")
                    }


                    /* THE USER SHOULD BE found if it has passed above check, now lets compare entered password
                     and password stored in the db using bcrypt.compare */

                    const isMatch = await bcrypt.compare(password, found.password);

                    if (!isMatch) { // if the password doesent match, do this:
                        throw new Error("Incorrect Password!");
                    }

                    // IF THE PROGRAM REACHES HERE, IT MEANS PASSWORD IS CORRECT (isMatch = true)
                    // SO NOW LET'S SEND A user object

                    const user = {
                        id: found._id,
                        email: email
                    }

                    return user;


                }

                // ERROR HANDLING
                catch (err) {
                    // THESE ERRORS WILL BE AVAILABLE IN res.error object!
                    const knownErrors = ["Please fill all fields!", "No user with the entered email was found!", "Incorrect Password!"];
                    if (knownErrors.includes(err.message)) {
                        throw new Error(err.message)
                    }
                    else {
                        throw new Error("Server down! Please try again later!")

                    }

                }


            }
        }),

        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })

    ],
    callbacks: {
        jwt: async function ({ token, user }) {

            if(user){ // user object is ONLY DEFINED ON INITIAL SIGN IN, So the if (user) check is essential to: Add user info to token only on sign-in, Keep token intact on later calls. */
            token.id = user.id;
            token.name=user.name || "User"
            console.log("JWT TOKEN:\n", token);
            }
            return token; // always return token whether user exist OR NO
        },
        session: async function ({ session,token }) {
            session.user.id = token.id;
            session.user.name=token.name;
            console.log("SESSION VARIABLE:\n", session);
            return session;
        }
    }
}


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
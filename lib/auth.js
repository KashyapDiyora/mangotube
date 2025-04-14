import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { ConnectToDatabase } from "./db.js";
import { User } from "@/models/User.js";
import bcrypt from "bcryptjs";

export const authOption = {
    providers : [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        CredentialsProvider({
            name : "credentials",
            credentials : {
                email : {label:"Email",type : "email"},
                password : {label : "Password",type : "password"}
            },
            async authorize(credentials){
                try {
                    if(!credentials.email || !credentials.password){
                        throw new Error("Missing email or password")
                    }

                    await ConnectToDatabase();
                    const user = await User.findOne({email : credentials.email});

                    if(!user){
                        throw new Error("No User Found");
                    }

                    const isValid = await bcrypt.compare(credentials.password,user.password);
                    if(!isValid){
                        throw new Error("Invalid Password");
                    }

                    return {
                        id : user._id.toString(),
                        email : user.email,
                        name : user.username,
                        image : user.coverImage
                    }

                } catch (error) {
                    return null;
                }
            }
        }),
    ],
    callbacks : {
        async jwt({token,user}){
            if(user){
                token.id = user?.id;
                token.name = user?.name;
                token.email = user?.email;
                token.image = user?.image;
            }
            return token;
        },
        async session({session,token}){
            if(session.user){
                session.user.id = token?.id;
                session.user.name = token?.name;
                session.user.email = token?.email;
                session.user.image = token?.image;
            }
            return session;
        },
        async signIn({user,account}){

            if(account.provider !== "credentials"){
                try {
                    await ConnectToDatabase();
                    
                    const userExists = await User.findOne({email : user?.email});
                    if(userExists){
                        user.id = userExists._id.toString();
                        return true;
                    }
                    const newUser = await User.create({
                        email: user.email,
                        username: user.name,
                        avatar: user.image,
                        provider: account.provider,
                        fullname : user.name
                    });
                    user.id = newUser._id.toString();
                    return true;
                } catch (error) {
                    console.log("error =>",error.message);
                    return false
                }
            }
            return true;
        }
    },
    session : {
        strategy : "jwt",
        maxAge : 30*24*60*60
    },
    pages : {
        signIn : "/login",
        error : "/login"
    },
    secret: process.env.NEXTAUTH_SECRET
}
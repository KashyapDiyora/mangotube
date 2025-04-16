import { Video } from "@/models/Video";
import { User } from "@/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/db";

export async function POST(request){
    try {
        const body = await request.json();
        const {videoUrl,thumbnailUrl,email,title,description,} = body;
        
        if(!videoUrl || !thumbnailUrl || !title || !description) {
            return NextResponse.json({
                error: 'All fields are required',
            }, { status: 400 });
        }   

        await ConnectToDatabase();
        const user = await User.findOne({email});
        const userId = user?._id;
        if(userId){
            const video = await Video.create({
                videoUrl,
                thumbnailUrl,
                owner : userId,
                title,
                description,
            });
            if(video){
                return NextResponse.json({
                    message: 'Video uploaded successfully',
                    video,
                }, { status: 201 });
            }
        }
        else {
            return NextResponse.json({
                error: 'User not found',
            }, { status: 404 });
        }

    } catch (error) {
        return NextResponse.json({
            error: `Something went wrong,${error?.message}`,
        }, { status: 500 });
    }
}
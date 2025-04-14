import { ConnectToDatabase } from "@/lib/db";
import { Like } from "@/models/Like";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request){
    const body = await request.json();
    const {likeBy,video} = body;
    
    try {
        if(!likeBy || !video){
            return NextResponse.json({
                message : "Please provide all the fields"
            },{status : 400});
        }

        await ConnectToDatabase();

        const res = await Like.findOne({
            likeBy,
            video
        });
        
        const totalLikes = await Like.countDocuments({video});
        if(!res){
            return NextResponse.json({
                like : false,
                video : false,
                totalLikes : totalLikes
            },{status : 200});
        }
        return NextResponse.json({
            like : res.likeBy,
            video : res.video,
            totalLikes : totalLikes
        },{status : 200});
    } catch (error) {
        return NextResponse.json({
            message : "Internal server error",
            error : error.message
        },{status : 500});
    }
}
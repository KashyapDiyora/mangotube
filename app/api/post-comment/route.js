import { NextResponse } from "next/server";
import { Comment } from "@/models/Comment";
import { ConnectToDatabase } from "@/lib/db";

export async function POST(request){
    const {commentMessage,videoId,userId} = await request.json();
    if(!commentMessage || !videoId || !userId){
        return NextResponse.json({message : "Comment message, videoId or userId not found"}, {status : 404});
    }
    
    try {
        const comment = await Comment.create({
            commentMessage,
            owner : userId,
            video : videoId
        })
        return NextResponse.json({
            message : "Comment added successfully",
            comment
        },{status : 201});
    } catch (error) {
        return NextResponse.json({
            message : "Error while adding comment",
            error : error.message
        },{status : 500});
    }
}
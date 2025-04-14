import { NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/db";
import { Comment } from "@/models/Comment";


export async function POST(request){
    const {userId,videoId} = await request.json();
    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    const limit = 4;
    const skip = (page - 1) * limit;
    if(!userId || !videoId){
        return NextResponse.json({message : "UserId or VideoId not found"}, {status : 404});
    }

    try {
        await ConnectToDatabase();
        const comments = await Comment.find({
            video : videoId,
            owner : userId
        }).sort({createdAt : -1})
        .skip(skip)
        .limit(limit)
        .populate('owner','avatar username');

        return NextResponse.json({
            comments
        },{status : 200});
        
    } catch (error) {
        return NextResponse.json({
            message : "Error while fetching comments",
            error : error.message
        },{status : 500});
    }
}
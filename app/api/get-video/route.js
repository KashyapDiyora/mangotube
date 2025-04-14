import { ConnectToDatabase } from "@/lib/db";
import { Video } from "@/models/Video";
import { NextResponse } from "next/server";

export async function GET(request) {

    const page = parseInt(request.nextUrl.searchParams.get('page')) || 1;
    
    await ConnectToDatabase();
    const limit = 12;
    const skip = (page - 1) * limit;
    const videos = await Video.find({}).sort({createdAt : -1})
    .skip(skip)
    .limit(limit)
    .populate('owner','avatar username');

    if(videos.length === 0) {
        return NextResponse.json({
            message : "No more videos found",
            videos : []
        },{status:404});
    }
    return NextResponse.json({
        videos
    },{status:200});
}
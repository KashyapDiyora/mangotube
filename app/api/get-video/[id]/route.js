import { Video } from "@/models/Video";
import { NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export async function GET(request, context) {
    const params = await context.params;
    const id = params.id;

    try {
        if(id){
            await ConnectToDatabase();
            const updatedVideo = await Video.findByIdAndUpdate(id,{$inc : {views : 1}},{new : true})
            .populate('owner');
            if(updatedVideo){
                const userId = updatedVideo.owner._id.toString();
                const videoId = updatedVideo._id.toString();
                const historyAddedUser = await User.findByIdAndUpdate(userId,{
                    $push : {
                        watchHistory : videoId
                    }
                });
                return NextResponse.json({
                    video : updatedVideo,
                },{status : 200});
            }
            else{
                return NextResponse.json({
                    message : "Failed to fetch the video"
                },{status : 500});
            }
        }
        else{
            return NextResponse.json({
                message : "id is missing"
            },{status : 400})
        }
    } catch (error) {
        return NextResponse.json({
            message : "Failed to fetch the video"
        },{status : 500});
    }
}
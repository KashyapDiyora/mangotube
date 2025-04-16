import { Video } from "@/models/Video";
import { NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";

export async function GET(request, context) {
    const session = await getServerSession(authOption);
    const params = await context.params;
    const id = params.id;
    try {
        if(id){
            await ConnectToDatabase();
            const updatedVideo = await Video.findByIdAndUpdate(id,{$inc : {views : 1}},{new : true})
            .populate('owner');
            if(updatedVideo){
                const userId = session?.user?.id;
                const videoId = updatedVideo._id.toString();
                await User.findByIdAndUpdate(userId, {
                    $pull: { watchHistory: videoId }
                  });
                const historyAddedUser = await User.findByIdAndUpdate(userId,{
                    $push : {
                        watchHistory : videoId
                    }},
                    { new: true }
                );
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
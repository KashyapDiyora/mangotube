import { Like } from "@/models/Like";
import { ConnectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    const body = await request.json();
    const {alreadyLike ,likeBy, video } = body;

    try {
        if(!likeBy || !video || alreadyLike == undefined) {
            return NextResponse.json({
                message: "Please provide all the fields"
            }, { status: 400 });
        }
        await ConnectToDatabase();  

        if(alreadyLike){
            const like = await Like.findOneAndDelete({likeBy, video});
            if(like.deletedCount == 0){
                return NextResponse.json({
                    message: "Like not found",
                    work : false
                }, { status: 404 });
            }
            return NextResponse.json({
                message: "Like removed successfully",
                work : true
            }, { status: 200 });
        }
        else{
            const like = await Like.create({likeBy, video});
            return NextResponse.json({
                message: "Like added successfully",
                work : true,
                like
            }, { status: 200 });
        }
        
    } catch (error) {
        return NextResponse.json({
            message: "Internal server error",
            error: error.message
        }, { status: 500 });
    }
}
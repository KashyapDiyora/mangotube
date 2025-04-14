import { ConnectToDatabase } from "@/lib/db";
import { Subscriber } from "@/models/Subscriber";
import { NextResponse } from "next/server";

export async function POST(request){
    const body = await request.json();
    const {alreadySubscribed,subscribe,channel} = body;
    
    try {
        if(!subscribe || !channel || alreadySubscribed == undefined){
            return NextResponse.json({
                message : "Please provide all the fields"
            },{status : 400});
        }
        await ConnectToDatabase();
        if(alreadySubscribed){
            const res = await Subscriber.deleteOne({
                subscriber : subscribe,
                channel : channel
            });
            if(res.deletedCount == 0){
                return NextResponse.json({
                    work : false
                },{status : 200});
            }
            return NextResponse.json({
                work : true
            },{status : 200});
        }
        else{
            const res = await Subscriber.create({
                subscriber : subscribe,
                channel : channel
            });
            return NextResponse.json({
                work : true
            },{status : 200});
        }
    } catch (error) {
        return NextResponse.json({
            message : "Internal server error",
            error : error.message
        },{status : 500});
    }
}
import { ConnectToDatabase } from "@/lib/db";
import { Subscriber } from "@/models/Subscriber";
import { NextResponse } from "next/server";

export async function POST(request) {
    const body = await request.json();
    const {subscribe,channel} = body;
    
    try {
        if(!subscribe || !channel){
            return NextResponse.json({
                message : "Please provide all the fields"
            },{status : 400});
        }
        await ConnectToDatabase();
        const res = await Subscriber.findOne({
            subscriber : subscribe,
            channel : channel
        });

        const total = await Subscriber.countDocuments({channel});
    
        if(!res){
            return NextResponse.json({
                subscribe : false,
                channel : false,
                totalSubscribers: total,
            },{status : 200});
        }
        return NextResponse.json({
            subscribe : res.subscriber,
            channel : res.channel,
            totalSubscribers: total,
        },{status : 200});
    } catch (error) {
        return NextResponse.json({
            message : "Internal server error",
            error : error.message
        },{status : 500});
    }
}
import { NextResponse } from "next/server";
import { Subscriber } from "@/models/Subscriber";
import { ConnectToDatabase } from "@/lib/db";

export async function POST(request) {
    const {userId} = await request.json();
    if(!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    try {
        await ConnectToDatabase();
        const subscribeChannel = await Subscriber.find({ subscriber : userId }).populate("channel", "username avatar _id");
        const channelsWithSubscribers = await Promise.all(
            subscribeChannel.map(async(sub) => {
                const totalSubscribers = await Subscriber.countDocuments({channel : sub.channel._id});
                return {
                    _id : sub.channel._id,
                    username : sub.channel.username,
                    avatar : sub.channel.avatar,
                    totalSubscribers : totalSubscribers,
                }
            })
        )
        
        if(subscribeChannel.length === 0) {
            return NextResponse.json({ ok : true ,message: "No channels found" , channels : [] }, { status: 200 });
        }
        return NextResponse.json({
            ok : true,
            channels : channelsWithSubscribers,
        },{status : 200});
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" }, { status: 500 }
        );
    }
}
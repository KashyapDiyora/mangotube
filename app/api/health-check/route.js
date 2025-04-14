import { ConnectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request){
    try {
        const conn = await ConnectToDatabase();
        return NextResponse.json({
            message : "connection establish"
        })
    } catch (error) {
        return NextResponse.json({
            error
        })
    }
}
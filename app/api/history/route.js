import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";

export async function GET(request) {
  const session = await getServerSession(authOption);
  if (!session) {
    return NextResponse.json({
      ok: false,
      message: "Not authenticated",
    },{status : 401});
  }

  try {
    const userId = session.user.id;
    const history = await User.findById({
      _id: userId,
    })
      .select("watchHistory")
      .populate({
        path: "watchHistory",
        select: "_id title thumbnailUrl views createdAt",
      }).lean();
      
      return NextResponse.json({
        ok : true,
        history : history.watchHistory,
        message : "History fetched successfully"
      },{status : 200});
  } 
  catch (error) {
    return NextResponse.json({
      ok: false,
      message: "Something went wrong",
    },{status : 500});
  }
}

import Image from "next/image";
import { Video } from "@/models/Video";
import { User } from "@/models/User";
import { ConnectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import SubscribeButton from "@/app/components/SubscribeButton";

export default async function ChannelPage({ params }) {
  await ConnectToDatabase();
  const session = await getServerSession(authOption);
  if(!session){
    redirect("/login");
  }
  const {channelname} = await params;
  
  const username = channelname.replace("_"," ");

  // Fetch user (channel)
  const user = await User.findOne({username : username}).select("username avatar description");

  // Fetch videos by that user
  const videos = await Video.find({ owner: user._id })
    .sort({ createdAt: -1 });
    // .populate("owner", "avatar username");

  // const subscriber = await Subscriber.countDocuments({channel : user._id});
  // const Subscribed = await Subscriber.findOne({
  //   subscriber : session?.user.id,
  //   channel : user._id
  // })
  // let isSubscribed = false;

    if(!user || !videos){
      return (
        <div>
          <Loader2 className="animate-spin text-gray-500 w-10 h-10 mx-auto mt-10" />
        </div>
      )
    }

  return (
    <div className="w-full">
      {/* Channel Header */}
      <div className="w-full bg-white px-4 md:px-10 lg:px-20 py-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <Image
              src={user.avatar}
              alt="Channel Avatar"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>

          {/* <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-sm text-gray-500">
              {subscriber} subscribers
            </p>
            <p className="mt-2 text-gray-600 text-sm max-w-2xl">
              {user.description || "No channel description yet."}
            </p>
          </div> */}

          <SubscribeButton username={user?.username} channelId={user?._id.toString()} userId={session?.user.id} />
        </div>
      </div>

      {/* Videos */}
      <div className="px-4 md:px-10 lg:px-20 py-8">
        <h2 className="text-lg font-semibold mb-4">Videos</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.length !== 0 ? videos.map((video) => (
            <div key={video._id} className="cursor-pointer">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={`${video.thumbnailUrl}?tr=w-640,h-360`}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="mt-3 text-sm text-black space-y-1">
                <div className="font-medium line-clamp-2">{video.title}</div>
                <div className="text-gray-500 text-xs">
                  {video.views || "1K"} views • 1 month ago
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-4 text-center text-gray-500">
              No videos uploaded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

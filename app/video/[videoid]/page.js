"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ThumbsUp, Share2, Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import Comment from "@/app/components/Comment";
import { useRouter } from "next/navigation";

function VideoPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (status == "loading") {
      setLoading(true);
      return;
    }
    if (!session) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [session, status]);

  const params = useParams();
  const videoid = useParams().videoid?.toString();
  const [video, setVideo] = useState({});
  const [subscribe, setSubscribe] = useState(false);
  const [like, setLike] = useState(false);
  const [totalSubscribe, setTotalSubscribe] = useState(0);
  const [totalLike, setTotalLike] = useState(0);
  const [fetched, setFetched] = useState({
    subscribe: false,
    like: false,
  });

  useEffect(() => {
    const fetchVideo = async () => {
      const res = await fetch(`/api/get-video/${videoid}`);
      const videoData = await res.json();
      setVideo(videoData.video);
    };
    fetchVideo();
  }, []);

  const fetchSubscribe = async () => {
    const res = await fetch("/api/get-subscribe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscribe: session?.user?.id,
          channel: video?.owner?._id,
        }),
      });
      const data = await res.json();
      setTotalSubscribe(data?.totalSubscribers);
      setFetched((prev) => ({...prev, subscribe: true }));
      if (data?.subscribe && data?.channel) {
        setSubscribe(true);
      } else {
        setSubscribe(false);
      }
};

  const fetchLike = async() => {
    const userId = session?.user?.id.toString();
    const videoId = videoid.toString();
    const res = await fetch("/api/get-like/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body : JSON.stringify({
          likeBy : userId,
          video : videoId
        })
      });
      const data = await res.json();
      
      setTotalLike(data?.totalLikes);
      setFetched((prev) => ({...prev, like: true }));
      if(data?.like && data?.video){
        setLike(true);
      }
      else{
        setLike(false);
      } 
}

  useEffect(() => {
    if (session?.user && video?.owner?._id) {
        fetchSubscribe();
    }
  }, [session?.user?.id, video?.owner?._id]);

  useEffect(() => {
    if(session?.user && videoid){
        fetchLike();
    }
  } ,[session?.user?.id, videoid]);

  const handleSubscribe = async () => {
    const res = await fetch("/api/subscribe/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alreadySubscribed: subscribe,
        subscribe: session?.user?.id,
        channel: video?.owner?._id,
      }),
    });
    const data = await res.json();
    if (data.work == true) {
      setSubscribe((prev) => !prev);
      if (!subscribe) {
        setTotalSubscribe((prev) => prev + 1);
      } else {
        setTotalSubscribe((prev) => prev - 1);
      }
    }
  };

  const handleLike = async() => {
    const res = await fetch("/api/like/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alreadyLike: like,
        likeBy: session?.user?.id,
        video: videoid
      }),
    });
    const data = await res.json();
    if(data.work == true){
      setLike((prev) => !prev);
      if(!like){
        setTotalLike((prev) => prev + 1);
      }
      else{
        setTotalLike((prev) => prev - 1);
      }
    }
  }

  if (!video?.owner?.avatar || !fetched.subscribe || !fetched.like || loading) {
    return <div className="text-center">
      <Loader2 className="w-10 h-10 animate-spin text-gray-500 mx-auto" />
    </div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="aspect-video rounded-2xl overflow-hidden shadow">
        {video && (
          <video src={video.videoUrl} className="w-full h-full" controls />
        )}
      </div>

      {/* Video Info */}
      <div className="mt-4">
        <h1 className="text-xl font-semibold">{video.title}</h1>
        <div className="text-sm text-gray-600 mt-1">
          {video.views} views • 1 month ago
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <button onClick={handleLike} className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition">
            <ThumbsUp className={`w-4 h-4 ${like ? "text-red-400" : ""}`} /> {totalLike} Like
          </button>
          <button className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            onClick={handleSubscribe}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <Bell className="w-4 h-4" />{" "}
            {subscribe ? "Subscribed" : "Subscribe"}
          </button>
        </div>
      </div>

      {/* Channel Info */}
      <Link
        href={`/channel/${video.owner.username.replace(" ", "_")}`}
        className="block"
      >
        <div className="flex items-start gap-4 mt-6 border-t pt-4">
          <Image
            src={video.owner?.avatar}
            alt="Channel"
            width={15}
            height={5}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-medium">{video.owner?.username}</div>
            <div className="text-sm text-gray-500">
              {totalSubscribe} subscribers
            </div>
          </div>
        </div>
      </Link>
      <p className="text-xs mt-2 text-black max-w-xl">
        Description :
      </p>
      <pre className="text-sm text-gray-500">
          {video.description}
      </pre>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Comments</h2>
        <Comment videoId={videoid} userId={session?.user?.id} userImage={session?.user?.image} />
      </div>

    </div>
  );
}

export default VideoPage;

"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {useSelector,useDispatch} from "react-redux";
import {incrementPageNo} from "@/lib/slices/pageNo.js"
import {addVideos} from "@/lib/slices/videos"
import {store} from "@/lib/store.js";

function VideoCard() {
  const videos = useSelector((state) => state.videos.videos);
  const dispatch = useDispatch();
  const [apiCalling, setApiCalling] = useState(false);
  const router = useRouter();
  // const page = useSelector((state) => state.pageNo.page);
  

  const fetchVideo = async () => {
    const currentPage = store.getState().pageNo.page;
    setApiCalling(true);
    try {
      const videoData = await fetch(`/api/get-video/?page=${currentPage}`);
      const { videos: newVideo } = await videoData.json();
      if(newVideo.length !== 0) {
        dispatch(addVideos(newVideo));
        dispatch(incrementPageNo());
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
    setApiCalling(false);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight && !apiCalling
    ) {
      fetchVideo();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const currentVideos = store.getState().videos.videos;
    if(currentVideos.length === 0) {
      fetchVideo();
    }
  }, []);

  if(videos.length === 0) {
    return (
      <div className="w-full px-4 md:px-8 lg:px-12">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
    {[...Array(8)].map((_, index) => (
      <div key={index} className="animate-pulse cursor-pointer">
        <div className="relative w-full aspect-video bg-gray-300 rounded-xl" />

        <div className="flex mt-3 gap-3">
          <div className="w-7 h-7 bg-gray-300 rounded-full" />

          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-3 bg-gray-300 rounded w-1/2" />
            <div className="h-3 bg-gray-300 rounded w-1/3" />
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

    )
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
        {videos &&
          videos.map((video, index) => (
            <div
              key={`${video._id}-${index}`}
              className="cursor-pointer"
              onClick={() => router.push(`video/${video._id}`)}
            >
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={`${video.thumbnailUrl}?tr=w-640,h-360`}
                  alt={video.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 640px"
                  priority
                  className="object-cover"
                />
              </div>

              <div className="flex mt-3 gap-3">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  <Image
                    src={video.owner?.avatar}
                    alt="Channel Avatar"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="text-sm text-black space-y-1">
                  <div className="font-medium line-clamp-2">{video.title}</div>
                  <div className="text-gray-600">{video.owner?.username}</div>
                  <div className="text-gray-500 text-xs">
                    {video.views || "1K"} views • 1 month ago
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default VideoCard;

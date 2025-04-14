import {useState} from 'react'
import { useParams } from "next/navigation";
import { Loader2 } from 'lucide-react';

function VideoFeed({video,setVideo,params}) {
    
    const [video, setVideo] = useState({});
    const params = useParams();
    const { videoid } = params;

    useEffect(() => {
        const fetchVideo = async () => {
          const res = await fetch(`/api/get-video/${videoid}`);
          const videoData = await res.json();
          setVideo(videoData.video);
        };
        fetchVideo();
      }, []);
    
    if(!video) {
        return <div>
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>;
    }

  return (
    <>
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
        
      </div>
    </>
  )
}

export default VideoFeed
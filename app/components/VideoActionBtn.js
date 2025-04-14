import { useState } from "react";
import { ThumbsUp, Share2, Bell, Loader } from "lucide-react";

function VideoActionBtn() {
  const [totalLike, setTotalLike] = useState(0);
  const [subscribe, setSubscribe] = useState(false);

  useEffect(() => {
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
          console.log(data);
          setTotalSubscribe(data?.totalSubscribers);
          setFetched((prev) => ({...prev, subscribe: true }));
          if (data?.subscribe && data?.channel) {
            setSubscribe(true);
          } else {
            setSubscribe(false);
          }
    };
    if (session?.user && video?.owner?._id) {
        fetchSubscribe();
    }
  }, [session?.user?.id, video?.owner?._id]);

  useEffect(() => {
    const fetchLike = async() => {
        const res = await fetch("/api/get-like/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify({
              likeBy : session?.user?.id,
              video : videoid
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
    if(session?.user && videoid){
        fetchLike();
    }
  } ,[session?.user?.id, video?.owner?._id]);


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
      console.log("Subscribe", subscribe);
      if (!subscribe) {
        setTotalSubscribe((prev) => prev + 1);
      } else {
        setTotalSubscribe((prev) => prev - 1);
      }
    }
  };

  const handleLike = async () => {
    const res = await fetch("/api/like/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alreadyLike: like,
        likeBy: session?.user?.id,
        video: videoid,
      }),
    });
    const data = await res.json();
    if (data.work == true) {
      setLike((prev) => !prev);
      if (!like) {
        setTotalLike((prev) => prev + 1);
      } else {
        setTotalLike((prev) => prev - 1);
      }
    }
  };

  return (
    <div className="flex items-center gap-4 mt-3 flex-wrap">
      <button
        onClick={handleLike}
        className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
      >
        <ThumbsUp className={`w-4 h-4 ${like ? "text-red-400" : ""}`} />{" "}
        {totalLike} Like
      </button>
      <button className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition">
        <Share2 className="w-4 h-4" /> Share
      </button>
      <button
        onClick={handleSubscribe}
        className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
      >
        <Bell className="w-4 h-4" /> {subscribe ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
}

export default VideoActionBtn;

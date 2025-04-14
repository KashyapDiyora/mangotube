"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function History() {
  const [history, setHistory] = useState([]);
  const router = useRouter();
  const [apiCalling, setApiCalling] = useState(true);
  const fetchHistory = async () => {
    setApiCalling(true);
    const res = await fetch("/api/history", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    if (data.ok) {
      setHistory(data.history);
    } else if (data.message === "Not authenticated") {
      router.push("/login");
    }
    setApiCalling(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (apiCalling) {
    return (
      <Loader2 className="animate-spin h-10 w-10 text-center mx-auto mt-10" />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Watch History</h1>

      {history.length !== 0 ? (
        <div className="space-y-5">
          {history.map((video, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row gap-4 bg-white rounded-xl shadow-sm hover:shadow-md transition p-4"
            >
              <div className="relative w-full sm:w-60 h-36 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={video.thumbnailUrl}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col justify-between w-full">
                <div>
                  <h2 className="text-lg font-semibold line-clamp-2">
                    {video.title}
                  </h2>
                  <div className="text-sm text-gray-500 mt-1">
                    <p>{video.views.toLocaleString()} views</p>
                    <p>{new Date(video.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mt-4 sm:mt-0 sm:self-end">
                  <Link href={`/video/${video._id}/`} className="inline-block bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-red-600 transition" >                    
                    Watch Again
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h1 className="text-2xl font-semibold text-gray-700">
            No History Found Yet
          </h1>
          <p className="text-gray-500 mt-2">
            Videos you have watched will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

export default History;

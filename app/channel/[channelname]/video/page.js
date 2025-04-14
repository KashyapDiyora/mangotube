"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FileUpload from "@/app/components/FileUpload";
import { Loader2 } from "lucide-react";

function Video() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataUploading,setDataUploading] = useState(false);

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
  }, [session, status,router]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [uploadingNumber, setUploadingNumber] = useState(0);
  const [error,setError] = useState(null);
  const [uploading, setUploading] = useState({
    thumbnail: false,
    video: false,
  });

  const handleSubmit = async(event) => {
    event.preventDefault();
    
    if(!title || !description || !video.trim() || !thumbnail.trim()){
      setError("Please give required field");
      return;
    }
    setDataUploading(true);
    try {
      const res = await fetch("/api/video-upload",{
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({
          videoUrl : video,
          thumbnailUrl : thumbnail,
          email : session.user.email,
          title,
          description,
        })
      });
      const data = await res.json();
      console.log(data);
      
      if(res.status === 201){
        setError(null);
        router.push("/");
      }else if(res.status === 400){
        setError(data.error);
      }else{
        setError("Something went wrong");
      }
    } catch (error) {
      setError("Something went wrong");
    }
    setDataUploading(false);
  };

  const handleVideoSuccess = useCallback((res) => {
    if (res?.url) {
      setVideo(res.url);
      setUploading((prev) => ({ ...prev, video: true }));
  
      if (!thumbnail && res.thumbnailUrl) {
        setThumbnail(res.thumbnailUrl);
        setUploading((prev) => ({ ...prev, thumbnail: true }));
      }
    }
  }, []);
  

  const handleThumbnailSuccess = useCallback((res) => {
    if (res?.url) {
      setThumbnail(res.url);
      setUploading((prev) => ({ ...prev, thumbnail: true }));
    }
  }, []);  

  const handleProgress = useCallback((progressNumber) => {
    setUploadingNumber(progressNumber); 
  },[]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center py-10">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full py-5 md:py-6">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <form className="w-full h-full">
          <div className="flex items-center justify-center px-6 py-8 mx-auto lg:py-0">
            <div className="w-full bg-white rounded-lg shadow border md:mt-0 max-w-md md:max-w-lg xl:p-0">
              <div className="p-4 space-y-4 md:space-y-6 md:p-7">
                <p className="text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl lg:text-3xl">
                  Video Upload
                </p>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Video Title
                  </label>
                  <input
                    placeholder="Enter a title for your video"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Video Description
                  </label>
                  <textarea
                    placeholder="Write a description for your video"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Upload Thumbnail
                  </label>
                  <div className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5">
                    <FileUpload
                      fileType="image"
                      onSuccess={handleThumbnailSuccess}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Upload Video
                  </label>
                  <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                    {uploadingNumber !== 0 && <div
                      className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                      style={{ width: `${uploadingNumber}%` }} 
                    >
                      {uploadingNumber}%
                    </div>}
                  </div>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          MP4 Video File <br />
                          Max file size: 30MB
                        </p>
                      </div>
                      <FileUpload
                        fileType="video"
                        onSuccess={handleVideoSuccess}
                        onProgress={handleProgress}
                        id="dropzone-file"
                        styleProperty="hidden"
                      />
                    </label>
                  </div>
                </div>

                <button
                  className="w-full bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-blue-800 text-white"
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!(uploading.thumbnail && uploading.video)}
                >
                  {dataUploading ? (
                    <div className="w-full flex justify-center"><Loader2 className="w-10 h-7 animate-spin" /></div>
                  ) : (
                    "Upload Video"
                  )}
                </button>

                <div className="text-center">
                  Need help?{" "}
                  <Link href={"/"} className="text-gray-700 font-bold">
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Video;

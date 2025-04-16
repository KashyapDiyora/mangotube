"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function TopBarRight() {
  const { data : session, status } = useSession();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isCreate, setCreate] = useState(false);
  const [loading,setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [userImage,setUserImage] = useState("");

  useEffect(() => {
    if(status == "loading")
    {
      setLoading(true);
      return;
    }
    if(!session){
      setLoading(false);
    }
    if(session?.user){
      setLoading(false);
      setUserImage(session.user.image);
      setUsername(session.user.name);
    }
  },[session,status])

  const router = useRouter();
  const createRef = useRef(null);
  const userRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleDropdownCreate = () => {
    setCreate((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (createRef.current && !createRef.current.contains(event.target)) {
      setCreate(false);
    }
    if (userRef.current && !userRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const signIn = () => {
    router.push("/login");
  };

  const upload = () => {
    let channelName = session.user?.name;
    channelName = channelName.replace(" ","_")
    router.push(`/channel/${channelName}/video`);
  };

  const myChannel = () => {
    let channelName = session.user?.name;
    channelName = channelName.replace(" ","_")
    router.push(`/channel/${channelName}`);
  }

  const logoutUser = async () => {
    signOut();
  };

  return (
    <ul className="col-span-3 h-full">
      <li
        className={`w-full h-full flex items-center ${username ? "justify-evenly" : "justify-end"} sm:gap-2.5 md:gap-3 lg:gap-6`}
      >
        {username ? (
          <>
            <div className="flex w-full items-center relative">
              <div className="flex justify-evenly w-full relative">
                <div
                  ref={createRef}
                  onClick={toggleDropdownCreate}
                  className="hover:cursor-pointer relative text-[7px] sm:text-xs md:text-[1rem] flex items-center px-1 py-1 sm:px-1 sm:py-2 md:px-1.5 md:py-2.5 lg:px-3 lg:py-2.5 bg-[#F2F2F2] rounded-xl md:rounded-2xl"
                >
                  <img src="/plus.svg" alt="" className="w-2 sm:w-3 md:w-4" />
                  Create

                  {isCreate && (
                    <div className="absolute z-10 bg-gray-50 rounded-lg p-2 left-0 -right-10 top-[120%] shadow-lg">
                      <button className="w-full py-2 text-xs lg:text-sm text-gray-700 hover:bg-gray-200 rounded" onClick={upload}>
                        Video Upload
                      </button>
                    </div>
                  )}
                </div>
                <button>
                  <img src="/notification.svg" alt="" className="w-3 sm:w-4 md:w-5 lg:w-6" />
                </button>
                <div ref={userRef} className="flex items-center">
                  <button className="rounded-full relative cursor-pointer" onClick={toggleDropdown}>
                    <Image 
                    src={userImage} 
                    className="rounded-full object-cover" 
                    width={25} 
                    height={25} 
                    alt="user" />
                  </button>
                  {isOpen && (
                    <div className="absolute z-10 bg-gray-100 rounded-lg p-2 left-[25%] right-0 top-[150%] shadow-lg">
                      <button onClick={myChannel} className="w-full py-2 text-xs lg:text-sm text-gray-700 hover:bg-gray-200 rounded">
                        {username}
                      </button>
                      <button className="w-full py-2 text-xs lg:text-sm text-gray-700 hover:bg-gray-200 rounded" onClick={logoutUser}>
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={signIn}
              className="border-1 cursor-pointer border-black sm:text-xs md:text-[1rem] px-1 py-1 sm:px-1 sm:py-2 md:px-1.5 md:py-2.5 lg:px-3 lg:py-2.5 rounded-xl text-[7px] text-blue-400"
            >
              Sign in
            </button>
          </>
        )}
      </li>
    </ul>
  );
}

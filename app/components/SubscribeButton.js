"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function SubscribeButton({username, channelId, userId }) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalSubscribers, setTotalSubscribers] = useState(0);

    useEffect(() => {
        const fetchSubscriptionStatus = async () => {
            const res = await fetch("/api/get-subscribe",{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    subscribe : userId,
                    channel : channelId
                })
            });
            const data = await res.json();
            setTotalSubscribers(data.totalSubscribers);
            if(data.subscribe && data.channel){
                setSubscribed(true);
            }
        }
        fetchSubscriptionStatus();
    } ,[])

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alreadySubscribed: subscribed,
          subscribe: userId,
          channel: channelId,
        }),
      });

      const data = await res.json();
      if (data.work) {
        setSubscribed(!subscribed);
        if(!subscribed) {
          setTotalSubscribers((prev) => prev + 1);
        }
        else {
          setTotalSubscribers((prev) => prev - 1);
        }
      } else {
        console.error("Failed:", data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex-1">
        <h1 className="text-2xl font-bold">{username}</h1>
        <p className="text-sm text-gray-500">{totalSubscribers} subscribers</p>
      </div>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`text-sm px-4 py-2 w-28 rounded-full transition ${
          subscribed ? "bg-gray-800 text-white" : "bg-black text-white"
        }`}
      >
        {loading ? <Loader2 className="animate-spin text-gray-500 mx-auto w-6 h-6" />
        : subscribed ? "Subscribed" : "Subscribe"}
      </button>
    </>
  );
}

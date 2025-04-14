'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

const ChannelCard = React.memo(({ channel }) => (
  <div className="flex items-center justify-between bg-white p-5 rounded-2xl hover:bg-gray-50 transition shadow-md">
  {/* Avatar + Info */}
  <div className="flex items-center gap-5">
    <div className="w-16 h-16 relative rounded-full overflow-hidden">
      <Image
        src={channel.avatar}
        alt={channel.username}
        fill
        className="object-cover"
      />
    </div>
    <div>
      <p className="text-lg font-semibold text-gray-900">{channel.username}</p>
      <p className="text-sm text-gray-500">
        {channel.totalSubscribers.toLocaleString()} subscribers
      </p>
    </div>
  </div>

  {/* Action (View Channel) */}
  <Link href={`channel/${channel.username.replace(" ","_")}`} className="text-blue-600 text-base font-medium hover:underline transition">
    View Channel
  </Link>
  </div>

));

ChannelCard.displayName = 'ChannelCard';

function SubscriptionPage() {
  const { data: session } = useSession();
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChannels = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session?.user.id,
          }),
        });

        const data = await res.json();
        
        if (data.ok) {
          setChannels(data.channels);
        } else {
          setError("Failed to fetch channels.");
        }
      } catch (error) {
        setError("Failed to fetch channels.");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchChannels();
    }
  }, [session?.user?.id]);

  const renderedChannels = useMemo(() => (
    channels.map(channel => (
      <ChannelCard key={channel._id} channel={channel} />
    ))
  ), [channels]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-gray-500" size={24} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Subscribed Channels</h1>
      {error && <p className="text-red-500 text-xl">{error}</p>}
      {channels.length === 0 ? (
        <p className="text-gray-500 text-center">You have not subscribed to any channels yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {renderedChannels}
        </div>
      )}
    </div>
  );
}

export default SubscriptionPage;

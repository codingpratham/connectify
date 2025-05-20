import React, { useEffect, useState } from 'react';
import FriendCard from '../components/FriendCard';
import NoFriendsFound from '../components/NoFriendsFound';

type Friend = {
  id: string;
  fullName: string;
  profilePic?: string;
  location?: string;
  nativeLanguage?: string;
  learningLanguage?: string;
};

const FriendPage = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoadingFriends, setLoadingFriends] = useState(true);

  // Retrieve token from localStorage or your auth context/provider
  const token = localStorage.getItem('token');

  useEffect(() => {
    const getUserFriends = async () => {
      try {
        setLoadingFriends(true);
        const res = await fetch("http://localhost:3000/api/user/friends", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setFriends(data || []);
      } catch (error) {
        console.error("Failed to fetch friends", error);
      } finally {
        setLoadingFriends(false);
      }
    };
    getUserFriends();
  }, [token]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#171111] min-h-screen text-white overflow-y-auto">
      <div className="container mx-auto max-w-4xl space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Friends
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          This page shows your list of friends and allows you to manage connections.
        </p>

        {isLoadingFriends ? (
          <div className="text-center py-10">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length > 0 ? (
          <div className="space-y-4">
            {friends.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        ) : (
          <NoFriendsFound />
        )}
      </div>
    </div>
  );
};

export default FriendPage;

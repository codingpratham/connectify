import { useEffect, useState } from "react";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

type User = {
  id?: string;
  fullName: string;
  profilePic: string;
  location?: string;
  bio?: string;
};

type FriendRequest = {
  id: string;
  receiver: User;
  sender: User;
};

const HomePage = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [recommendedUsers, setRecommendedUsers] = useState<User[]>([]);
  const [outgoingFriendReqs, setOutgoingFriendReqs] = useState<FriendRequest[]>([]);
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState<Set<string>>(new Set());
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [sendingRequestId, setSendingRequestId] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  localStorage.getItem("profilePic");

  // Fetch friends
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

  // Fetch recommended users
  useEffect(() => {
    const getRecommended = async () => {
      try {
        setLoadingUsers(true);
        const res = await fetch("http://localhost:3000/api/user", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setRecommendedUsers(data || []);
      } catch (error) {
        console.error("Failed to fetch recommended users", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    getRecommended();
  }, [token]);

  // Fetch outgoing friend requests
  useEffect(() => {
    const fetchOutgoingRequests = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user/outgoing-friend-requests", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setOutgoingFriendReqs(data || []);
      } catch (error) {
        console.error("Failed to fetch outgoing friend requests", error);
      }
    };
    fetchOutgoingRequests();
  }, [token]);

  // Track sent request IDs
  useEffect(() => {
    const outgoingIds = new Set<string>();
    outgoingFriendReqs.forEach((req) => {
      if (req.receiver?.id) {
        outgoingIds.add(req.receiver.id);
      }
    });
    setOutgoingRequestsIds(outgoingIds);
  }, [outgoingFriendReqs]);

  const handleSendRequest = async (userId: string) => {
    try {
      setSendingRequestId(userId);
      await fetch(`http://localhost:3000/api/user/friend-request/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Refetch outgoing requests
      const res = await fetch("http://localhost:3000/api/user/outgoing-friend-requests", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setOutgoingFriendReqs(data || []);
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setSendingRequestId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#171111] h-screen text-white overflow-y-auto">
      <div className="container mx-auto space-y-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link
            to="/notifications"
            className="inline-flex items-center gap-2 px-4 py-1.5 border border-white text-white rounded-full text-sm font-medium hover:bg-white hover:text-black transition"
          >
            <UsersIcon className="size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Discover and Connect with Alumni</h2>
                <p className="opacity-70">
                  Discover the perfect alumni match to chat and grow together.
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back soon for new alumni to connect with!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = !!user.id && outgoingRequestsIds.has(user.id);
                const isSending = sendingRequestId === user.id;

                return (
                  <div
                    key={user.id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                      <button
                        className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                          } `}
                        onClick={() => user.id && handleSendRequest(user.id)}
                        disabled={hasRequestBeenSent || isSending || !user.id}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : isSending ? (
                          <>Sending...</>
                        ) : (
                          <>
                            <div className="flex justify-center mt-4">
                              <button className="flex items-center bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-2 transition">
                                <div className="flex items-center justify-center w-5 h-5 bg-green-600 rounded-full mr-2">
                                  <UserPlusIcon className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-sm font-medium">Send Friend Request</span>
                              </button>
                            </div>


                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;

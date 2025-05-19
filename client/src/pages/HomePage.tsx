import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";

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
  _id: string;
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

  // Fetch friends
  useEffect(() => {
    setLoadingFriends(true);
    getUserFriends()
      .then((data) => {
        setFriends(data || []);
      })
      .finally(() => setLoadingFriends(false));
  }, []);

  // Fetch recommended users
  useEffect(() => {
    setLoadingUsers(true);
    getRecommendedUsers()
      .then((data) => {
        setRecommendedUsers(data || []);
      })
      .finally(() => setLoadingUsers(false));
  }, []);

  // Fetch outgoing friend requests
  useEffect(() => {
    getOutgoingFriendReqs()
      .then((data) => {
        setOutgoingFriendReqs(data || []);
      });
  }, []);

  // Update set of outgoing request recipient ids
  useEffect(() => {
    const outgoingIds = new Set<string>();
    if (outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.receiver.id as string);
      });
    }
    setOutgoingRequestsIds(outgoingIds);
  }, [outgoingFriendReqs]);

  const handleSendRequest = (userId: string) => {
    setSendingRequestId(userId);
    sendFriendRequest(userId)
      .then(() => {
        // Refetch outgoing friend requests after success
        return getOutgoingFriendReqs();
      })
      .then((data) => {
        setOutgoingFriendReqs(data || []);
      })
      .finally(() => setSendingRequestId(null));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#171111] h-screen text-white">
      <div className="container mx-auto space-y-10">
        <div className="flex items-center justify-between flex-wrap gap-4 border-white">
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
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your profile
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
                Check back later for new language partners!
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

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
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
                          <>
                            Sending...
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
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

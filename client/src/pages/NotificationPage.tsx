import { useEffect, useState } from "react";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";

type User = {
  id: string;
  fullName: string;
  profilePic: string;
  location?: string;
};

type FriendRequest = {
  id: string;
  sender: User;
  receiver: User;
};

const NotificationsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/user/friend-requests", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();

        // Correct response keys
        const { incomingRequests, acceptedRequests } = data;

        setIncomingRequests(Array.isArray(incomingRequests) ? incomingRequests : []);
        setAcceptedRequests(Array.isArray(acceptedRequests) ? acceptedRequests : []);
      } catch (error) {
        console.error("Failed to fetch friend requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const acceptRequestMutation = async (id: string) => {
    setIsPending(true);
    try {
      const response = await fetch(`http://localhost:3000/api/user/friend-request/${id}/accept`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to accept request");

      // Update UI
      setIncomingRequests((prev) => {
        const request = prev.find((r) => r.id === id);
        if (request) {
          setAcceptedRequests((accepted) => [...accepted, request]);
        }
        return prev.filter((r) => r.id !== id);
      });
    } catch (error) {
      console.error("Failed to accept friend request:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#171111] text-white h-screen overflow-y-auto">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notifications
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {/* INCOMING REQUESTS */}
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              <img
                                src={request.sender.profilePic}
                                alt={request.sender.fullName}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {request.sender.fullName}
                              </h3>
                              <p className="text-sm text-base-content opacity-70">
                                {request.sender.location || "Unknown location"}
                              </p>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm bg-green-500 rounded-full text-white"
                            onClick={() => acceptRequestMutation(request.id)}
                            disabled={isPending}
                          >
                            {isPending ? "Accepting..." : "Accept"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQUESTS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => {
                    const user = notification.sender || notification.receiver;
                    return (
                      <div
                        key={notification.id}
                        className="card bg-base-200 shadow-sm"
                      >
                        <div className="card-body p-4">
                          <div className="flex items-start gap-3">
                            <div className="avatar mt-1 size-10 rounded-full">
                              <img
                                src={user.profilePic}
                                alt={user.fullName}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{user.fullName}</h3>
                              <p className="text-sm my-1">
                                {user.fullName} accepted your friend request
                              </p>
                              <p className="text-xs flex items-center opacity-70">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                Recently
                              </p>
                            </div>
                            <div className="badge badge-success">
                              <MessageSquareIcon className="h-3 w-3 mr-1" />
                              New Friend
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 &&
              acceptedRequests.length === 0 && <NoNotificationsFound />}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;

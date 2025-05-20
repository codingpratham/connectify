const API_URL = "http://localhost:3000/api/user";

export const fetchFriendRequests = async () => {
  const response = await fetch(`${API_URL}/friend-requests`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch requests");
  return response.json();
};

export const acceptFriendRequest = async (id: string) => {
  const response = await fetch(`${API_URL}/friend-request/${id}/accept`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to accept request");
  return response.json();
};

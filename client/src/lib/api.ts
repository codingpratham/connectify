/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "./axios";

export async function getUserFriends() {
  const response = await axiosInstance.get("/user/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/user");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/user/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId : any) {
  const response = await axiosInstance.post(`/user/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/user/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId : any) {
  const response = await axiosInstance.put(`/user/friend-request/${requestId}/accept`);
  return response.data;
}

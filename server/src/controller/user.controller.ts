import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getRecommendedUsers = async (req: Request, res: Response) => {
  try {
    
    const currentUserId = req.userId
    const currentUser = await prisma.user.findUnique({
      where: {
        id: currentUserId,
      },
      include: {
        friends: true,
      },
    })
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const recommendedUsers = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
          notIn: currentUser.friends.map(friend => friend.id)
        },
        isOnboarded: true,
      },
    })
    if (!recommendedUsers) {
      return res.status(404).json({ message: "No recommended users found" });
    }
    return res.status(200).json(recommendedUsers);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getMyFriends = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select:{
        friends: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePic: true,
          }
        }
      }
    })
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user.friends);

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
    
  }
}

export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const myId = req.userId;
    const { id: receiverId } = req.params;

    if (!myId) {
      return res.status(400).json({ message: "Invalid sender ID" });
    }

    if (myId === receiverId) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself" });
    }

    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
      include: {
        friends: true,
        receivedRequests:true,
        sentRequests:true,
      },
    })
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (receiver.friends.some(friend => friend.id === myId)) {
      return res.status(400).json({ message: "You are already friends" });
    }

    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR:[
          {
            senderId: myId,
            receiverId: receiverId,
          },
          {
            senderId: receiverId,
            receiverId: myId,
          },
        ]
      },
      
    })

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: myId,
        receiverId: receiverId,
        status: "PENDING",
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePic: true,
          }
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePic: true,
          }
        }
      }
    })
    
    res.status(200).json({
      friendRequest
    })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const acceptFriendRequest = async (req: Request, res: Response) => {
  try {
    const {id :requestId} = req.params

    const friendRequest = await prisma.friendRequest.findUnique({
      where: {
        id: requestId,
      },
    })

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.status !== "PENDING") {
      return res.status(400).json({ message: "Friend request already accepted or rejected" });
    }
    
    if (!req.userId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if(friendRequest.receiverId.toString() !== req.userId.toString()){
      return res.status(403).json({ message: "You are not authorized to accept this friend request" });
    }

    friendRequest.status = "ACCEPTED";

    await prisma.friendRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: "ACCEPTED",
      },
    })

    await prisma.user.update({
      where: {
        id: friendRequest.senderId,
      },
      data: {
        friends: {
          connect: {
            id: friendRequest.receiverId,
          },
        },
      },
    })
    await prisma.user.update({
      where: {
        id: friendRequest.receiverId,
      },
      data: {
        friends: {
          connect: {
            id: friendRequest.senderId,
          },
        },
      },
    })

    return res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
    
  }
}

export async function getFriendRequests(req: Request, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Friend requests sent to current user (incoming) with status PENDING
    const incomingReqs = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: "PENDING",
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            profilePic: true,
          },
        },
      },
    });

    // Friend requests sent by current user and accepted
    const acceptedReqs = await prisma.friendRequest.findMany({
      where: {
        senderId: userId,
        status: "ACCEPTED",
      },
      include: {
        receiver: {
          select: {
            id: true,
            fullName: true,
            profilePic: true,
          },
        },
      },
    });

    return res.status(200).json({
      incomingRequests: incomingReqs,
      acceptedRequests: acceptedReqs,
    });
  } catch (error: any) {
    console.error("Error in getFriendRequests controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function getOutgoingFriendReqs(req: Request, res: Response) {
  try {
    const outgoingRequests = await prisma.friendRequest.findMany({
      where: {
        senderId: req.userId,
        status: "PENDING",
      },
      include: {
        receiver: {
          select: {
            fullName: true,
            profilePic: true,
            
          },
        },
      },
    });

    res.status(200).json(outgoingRequests);
  } catch (error) {
    
    res.status(500).json({ message: "Internal Server Error" });
  }
}
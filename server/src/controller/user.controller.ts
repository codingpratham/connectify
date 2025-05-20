import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// Get Recommended Users
export const getRecommendedUsers = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.userId;
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      include: { friends: true },
    });

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recommendedUsers = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
          notIn: currentUser.friends.map((friend) => friend.id),
        },
        isOnboarded: true,
      },
    });

    return res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error('getRecommendedUsers error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get My Friends
export const getMyFriends = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        friends: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePic: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user.friends);
  } catch (error) {
    console.error('getMyFriends error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Send Friend Request
export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const myId = req.userId;
    const { id: receiverId } = req.params;

    if (!myId || myId === receiverId) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      include: { friends: true },
    });

    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    if (receiver.friends.some((f) => f.id === myId)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: myId, receiverId },
          { senderId: receiverId, receiverId: myId },
        ],
      },
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already exists' });
    }

    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: myId,
        receiverId,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: { id: true, fullName: true, email: true, profilePic: true },
        },
        receiver: {
          select: { id: true, fullName: true, email: true, profilePic: true },
        },
      },
    });

    return res.status(200).json({ friendRequest });
  } catch (error) {
    console.error('sendFriendRequest error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Accept Friend Request
export const acceptFriendRequest = async (req: Request, res: Response) => {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (friendRequest.status !== 'PENDING') {
      return res.status(400).json({ message: 'Already processed' });
    }

    if (!req.userId || friendRequest.receiverId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update request status
    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    });

    // Connect users as friends
    await prisma.user.update({
      where: { id: friendRequest.senderId },
      data: {
        friends: {
          connect: { id: friendRequest.receiverId },
        },
      },
    });

    await prisma.user.update({
      where: { id: friendRequest.receiverId },
      data: {
        friends: {
          connect: { id: friendRequest.senderId },
        },
      },
    });

    return res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('acceptFriendRequest error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Incoming & Accepted Requests
export const getFriendRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const incomingRequests = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: { id: true, fullName: true, profilePic: true, location: true },
        },
      },
    });

    const acceptedRequests = await prisma.friendRequest.findMany({
      where: {
        senderId: userId,
        status: 'ACCEPTED',
      },
      include: {
        receiver: {
          select: { id: true, fullName: true, profilePic: true, location: true },
        },
      },
    });

    return res.status(200).json({
      incomingRequests,
      acceptedRequests,
    });
  } catch (error) {
    console.error('getFriendRequests error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Outgoing Requests
export const getOutgoingFriendReqs = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const outgoingRequests = await prisma.friendRequest.findMany({
      where: {
        senderId: userId,
        status: 'PENDING',
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

    return res.status(200).json(outgoingRequests);
  } catch (error) {
    console.error('getOutgoingFriendReqs error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

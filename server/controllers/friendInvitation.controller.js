const prisma = require('../prismaClient');
const sendPushNotification = require('../socketControllers/notification');
const {
  updateUsersInvitations,
  updateUsersFriendsList,
} = require('../socketControllers/notifyConnectedSockets');

const inviteFriend = async (req, res) => {
  const { email: senderEmailAddress, userId } = req.user; // sender's email address and id
  const { email: receiverEmailAddress } = req.body;

  // check if user is inviting himself
  if (senderEmailAddress === receiverEmailAddress) {
    return res.status(400).send("Sorry, you can't invite yourself");
  }

  // check if the invited user exists in the database
  const targetUser = await prisma.user.findUnique({
    where: { email: receiverEmailAddress },
    include: { friends: true }
  });

  if (!targetUser) {
    return res
      .status(404)
      .send(
        "Sorry, the user you are trying to invite doesn't exist. Please check the email address"
      );
  }

  // check if invitation has already been sent
  const invitationAlreadyExists = await prisma.friendInvitation.findFirst({
    where: {
      senderId: userId,
      receiverId: targetUser.id,
    }
  });

  if (invitationAlreadyExists) {
    return res
      .status(409)
      .send('You have already sent an invitation to this user');
  }

  // check if the invited user is already a friend of the sender
  const isAlreadyFriend = targetUser.friends.some(
    (friend) => friend.id === userId
  );

  if (isAlreadyFriend) {
    return res
      .status(409)
      .send(
        'You are already friends with this user. Please check your friend first'
      );
  }

  // create invitation

  await prisma.friendInvitation.create({
    data: {
      senderId: userId,
      receiverId: targetUser.id,
    }
  });

  // after successfully creating the invitation, update the target user's pending invitation list
  // with the new invitation in real time using sockets if the target user is online
  updateUsersInvitations(targetUser.id, 'new');

  const sender = await prisma.user.findUnique({ where: { id: userId } });

  // Send the push notification to the receiver
  sendPushNotification({
    sender: sender,
    receiver: targetUser,
    message: {
      content: `${sender.username} has sent you a friend request`,
      _id: `${userId}-${targetUser.id}-invitation`,
    },
  });

  return res
    .status(201)
    .send('Invitation has been sent successfully');
};

const acceptInvitation = async (req, res) => {
  try {
    const { invitationId } = req.body;

    // check if invitation exists
    const invitation = await prisma.friendInvitation.findUnique({
      where: { id: invitationId }
    });

    if (!invitation) {
      return res
        .status(404)
        .send(
          "Sorry, the invitation you are trying to accept doesn't exist"
        );
    }

    // accept the invitation

    const deletedInvitation = await prisma.friendInvitation.delete({
      where: { id: invitationId }
    });

    // update friends list of both users in the database
    const sender = await prisma.user.update({
      where: { id: deletedInvitation.senderId },
      data: { friends: { connect: { id: req.user.userId } } }
    });

    const receiver = await prisma.user.update({
      where: { id: req.user.userId },
      data: { friends: { connect: { id: deletedInvitation.senderId } } }
    });

    // update the user's(user accepting the invitation) pending invitations list
    updateUsersInvitations(req.user.userId);

    // update the user's(user accepting the invitation, receiver) friends list
    updateUsersFriendsList(req.user.userId);

    // update the user's(user who has sent the invitation, sender) friends list
    updateUsersFriendsList(deletedInvitation.senderId);

    // Send the push notification to the sender of the invitation
    sendPushNotification({
      sender: receiver,
      receiver: sender, // sender of the invitation is now the receiver of the push notification
      message: {
        content: `${receiver.username} has accepted your friend request`,
        _id: `${receiver.id}-${sender.id}-accepted`,
      },
    });

    return res.status(200).send('Invitation accepted successfully!');
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send('Sorry, something went wrong. Please try again later');
  }
};

const rejectInvitation = async (req, res) => {
  try {
    const { invitationId } = req.body;

    // check if invitation exists
    const invitation = await prisma.friendInvitation.findUnique({
      where: { id: invitationId }
    });

    if (!invitation) {
      return res
        .status(404)
        .send(
          "Sorry, the invitation you are trying to reject doesn't exist"
        );
    }

    // reject the invitation
    await prisma.friendInvitation.delete({
      where: { id: invitationId }
    });

    // update the user's pending invitations list
    updateUsersInvitations(req.user.userId);

    return res.status(200).send('Invitation rejected successfully!');
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send('Sorry, something went wrong. Please try again later');
  }
};

const removeFriend = async (req, res) => {
  try {
    const { userId } = req.user;
    const { friendId } = req.body;

    // check if friend exists
    const friend = await prisma.user.findUnique({ where: { id: friendId } });

    if (!friend) {
      return res
        .status(404)
        .send(
          "Sorry, the user you are trying to unfriend doesn't exist"
        );
    }

    const currentUser = await prisma.user.findUnique({ where: { id: userId } });

    // update friends list of both users in the database
    await prisma.user.update({
      where: { id: friend.id },
      data: { friends: { disconnect: { id: currentUser.id } } }
    });

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { friends: { disconnect: { id: friend.id } } }
    });

    // update both users friends list
    updateUsersFriendsList(currentUser.id);
    updateUsersFriendsList(friend.id);

    // Send the push notification to the friend who has been removed
    sendPushNotification({
      sender: currentUser,
      receiver: friend,
      message: {
        content: `${currentUser.username} has removed you from their friends' list!`,
        _id: `${currentUser.id}-${friend.id}-removed`,
      },
    });

    return res.status(200).send('Friend removed successfully!');
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send('Sorry, something went wrong. Please try again later');
  }
};

module.exports = {
  inviteFriend,
  acceptInvitation,
  rejectInvitation,
  removeFriend,
};

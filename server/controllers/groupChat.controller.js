const prisma = require('../prismaClient');
const {
  updateUsersGroupChatList,
} = require('../socketControllers/notifyConnectedSockets');
const sendPushNotification = require('../socketControllers/notification');

const createGroupChat = async (req, res) => {
  try {
    const { email, userId } = req.user;
    const { name } = req.body;

    // create group
    const chat = await prisma.groupChat.create({
      data: {
        name: name,
        adminId: userId,
        participants: { connect: [{ id: userId }] },
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { groupChats: { connect: [{ id: chat.id }] } }
    });

    updateUsersGroupChatList(userId);

    return res.status(201).send('Group created successfully');
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send('Sorry, something went wrong. Please try again later');
  }
};

const addMemberToGroup = async (req, res) => {
  try {
    const { email, userId } = req.user;
    const { friendIds, groupChatId } = req.body;

    // check if groupChat exists
    const groupChat = await prisma.groupChat.findUnique({ 
      where: { id: groupChatId },
      include: { participants: true }
    });

    if (!groupChat) {
      return res
        .status(404)
        .send("Sorry, the group chat doesn't exist");
    }

    if (groupChat.adminId !== userId) {
      return res
        .status(403)
        .send(
          'Forbidden. Only group admin can add members to the group.'
        );
    }

    // add friends to the group
    const existingParticipantIds = groupChat.participants.map(p => p.id);
    const friendsToAddIds = friendIds.filter(id => !existingParticipantIds.includes(id));

    if (friendsToAddIds.length > 0) {
      await prisma.groupChat.update({
        where: { id: groupChatId },
        data: {
          participants: { connect: friendsToAddIds.map(id => ({ id })) }
        }
      });

      const currentUser = await prisma.user.findUnique({ where: { id: userId } });

      for (const friendId of friendsToAddIds) {
        // connect each user explicitly to groupChats as well
        const participant = await prisma.user.update({
          where: { id: friendId },
          data: { groupChats: { connect: [{ id: groupChatId }] } }
        });

        if (participant) {
          updateUsersGroupChatList(friendId);

          sendPushNotification({
            sender: currentUser,
            receiver: participant,
            message: {
              content: `${currentUser.username} has added you to the group "${groupChat.name}"`,
              _id: `${userId}-${participant.id}-${groupChat.id}-added`,
            },
          });
        }
      }
    }

    // update the admin's chat list
    updateUsersGroupChatList(groupChat.adminId);

    return res.status(200).send('Members added successfully!');
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send('Sorry, something went wrong. Please try again later');
  }
};

const leaveGroup = async (req, res) => {
  try {
    const { userId } = req.user;
    const { groupChatId } = req.body;

    // check if groupChat exists
    const groupChat = await prisma.groupChat.findUnique({ 
      where: { id: groupChatId },
      include: { participants: true }
    });

    if (!groupChat) {
      return res
        .status(404)
        .send("Sorry, the group chat doesn't exist");
    }

    const currentUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!currentUser) {
      return res.status(404).send('User not found');
    }

    // remove user from the group
    await prisma.groupChat.update({
      where: { id: groupChatId },
      data: { participants: { disconnect: { id: currentUser.id } } }
    });

    // remove groupChat from the list of user's groupChats
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { groupChats: { disconnect: { id: groupChat.id } } }
    });

    // update the chat list of user who left the chat.
    updateUsersGroupChatList(currentUser.id);

    const remainingParticipants = groupChat.participants.filter(p => p.id !== currentUser.id);
    for (const participant of remainingParticipants) {
      // update the participants chat list
      updateUsersGroupChatList(participant.id);

      const receiver = await prisma.user.findUnique({ where: { id: participant.id }});
      // send notification to all the participants of the group except the user who left the group
      sendPushNotification({
        sender: currentUser,
        receiver: receiver,
        message: {
          content: `${currentUser.username} has left the group!`,
          _id: `${currentUser.id}-${participant.id}-${groupChat.id}-left`,
        },
      });
    }

    return res.status(200).send('You have left the group!');
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send('Sorry, something went wrong. Please try again later');
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { userId } = req.user;
    const { groupChatId } = req.body;

    // check if groupChat exists
    const groupChat = await prisma.groupChat.findUnique({ 
      where: { id: groupChatId },
      include: { participants: true }
    });

    if (!groupChat) {
      return res
        .status(404)
        .send("Sorry, the group chat doesn't exist");
    }

    if (groupChat.adminId !== userId) {
      return res
        .status(403)
        .send('Forbidden. Only group admins can delete a group.');
    }

    // lastly delete the groupChat (cascade relations automatically handled or no need to manually filter since object is gone)
    await prisma.groupChat.delete({ where: { id: groupChatId } });
    
    // update groupChat list of all the participants
    for (const participant of groupChat.participants) {
      // update the users group chat list
      updateUsersGroupChatList(participant.id);
    }

    return res.status(200).send('Group deleted successfully!');
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send('Sorry, something went wrong. Please try again later');
  }
};

module.exports = {
  createGroupChat,
  addMemberToGroup,
  leaveGroup,
  deleteGroup,
};

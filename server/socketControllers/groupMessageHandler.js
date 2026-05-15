const prisma = require('../prismaClient');
const sendPushNotification = require('./notification');
const {
  updateChatHistory,
  sendNewGroupMessage,
} = require('./notifyConnectedSockets');

const groupMessageHandler = async (socket, data) => {
  try {
    const { groupChatId, message } = data;
    const senderUserId = socket.user.userId;

    // check if groupChat exists
    const groupChat = await prisma.groupChat.findUnique({ 
        where: { id: groupChatId },
        include: { participants: true }
    });

    if (!groupChat) {
      return;
    }

    const newMessage = await prisma.message.create({
        data: {
          authorId: senderUserId,
          content: message,
          type: 'GROUP',
          groupChatId: groupChat.id
        }
    });

    // update the chat of the participants with newly sent message
    sendNewGroupMessage(groupChat.id, newMessage);

    // Send the push notification to the all the participants of the group except the sender
    groupChat.participants.forEach(async (participant) => {
      if (participant.id !== senderUserId) {
        const receiver = await prisma.user.findUnique({ 
          where: { id: participant.id },
          include: { pushSubscriptions: true }
        });
        const sender = await prisma.user.findUnique({ where: { id: senderUserId }});
        sendPushNotification({
          sender,
          receiver,
          message: newMessage,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = groupMessageHandler;

const prisma = require('../prismaClient');
const {
  updateChatHistory,
  sendNewDirectMessage,
} = require('./notifyConnectedSockets');
const sendPushNotification = require('./notification');

const directMessageHandler = async (socket, data) => {
  try {
    const { receiverUserId, message } = data;
    const senderUserId = socket.user.userId;

    // check if conversation between sender and receiver already exists
    // we find a conversation where BOTH participants are present
    const conversations = await prisma.conversation.findMany({
      where: {
        AND: [
          { participants: { some: { id: senderUserId } } },
          { participants: { some: { id: receiverUserId } } }
        ]
      }
    });
    
    let conversation = conversations[0];

    let newMessage;

    // if conversation exists, append the message to the conversation
    if (conversation) {
      console.log('conversation already exists');

      newMessage = await prisma.message.create({
        data: {
          authorId: senderUserId,
          content: message,
          type: 'DIRECT',
          conversationId: conversation.id
        }
      });

      // update the chat of the participants with newly sent message
      sendNewDirectMessage(conversation.id, newMessage);
    } else {
      console.log('creating new conversation');
      // create conversation
      conversation = await prisma.conversation.create({
        data: {
          participants: { connect: [{ id: senderUserId }, { id: receiverUserId }] },
        }
      });

      newMessage = await prisma.message.create({
        data: {
          authorId: senderUserId,
          content: message,
          type: 'DIRECT',
          conversationId: conversation.id
        }
      });

      // update the chat of the participants with newly sent message
      sendNewDirectMessage(
        conversation.id,
        newMessage
      );
    }

    const receiver = await prisma.user.findUnique({ 
      where: { id: receiverUserId },
      include: { pushSubscriptions: true }
    });
    const sender = await prisma.user.findUnique({ where: { id: senderUserId }});

    // Send the push notification to the receiver
    sendPushNotification({
      sender,
      receiver,
      message: newMessage,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = directMessageHandler;

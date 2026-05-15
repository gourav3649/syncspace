const prisma = require('../prismaClient');
const {
  getServerSocketInstance,
  getActiveConnections,
} = require('../socket/connectedUsers');
const sendPushNotification = require('./notification');

const callRequestHandler = async (socket, data) => {
  const { receiverUserId, callerName, audioOnly, signal } = data;
  const callerUserId = socket.user.userId;

  // active connections of the receiver user
  const activeConnections = getActiveConnections(receiverUserId);

  // send call request to all the active connections of the receiver user
  const io = getServerSocketInstance();

  activeConnections.forEach((socketId) => {
    io.to(socketId).emit('call-request', {
      callerName,
      callerUserId,
      audioOnly,
      signal,
    });
  });

  // Send push notification to the receiver of the call
  try {
    const sender = await prisma.user.findUnique({ where: { id: callerUserId } });
    const receiver = await prisma.user.findUnique({
      where: { id: receiverUserId },
      include: { pushSubscriptions: true },
    });

    if (sender && receiver) {
      sendPushNotification({
        sender,
        receiver,
        message: {
          content: `${sender.username} is calling you!`,
          id: `${callerUserId}-${receiverUserId}-call`,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = callRequestHandler;

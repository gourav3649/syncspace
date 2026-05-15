const prisma = require('../prismaClient');
const { getServerSocketInstance } = require("../socket/connectedUsers");
const { updateChatHistory } = require("./notifyConnectedSockets");


const directChatHistoryHandler = async (socket, receiverUserId) => {

    try {
        const senderUserId = socket.user.userId;

        // get the conversation between the sender(logged in user) and receiver
        const conversations = await prisma.conversation.findMany({
            where: {
                AND: [
                    { participants: { some: { id: senderUserId } } },
                    { participants: { some: { id: receiverUserId } } }
                ]
            }
        });

        const conversation = conversations[0];

        if (!conversation) {
            return;
        }

        // update the chat history of the connecting user
        updateChatHistory(conversation.id, socket.id);
    }catch(err){
        console.log(err);
    }

}


module.exports = directChatHistoryHandler;
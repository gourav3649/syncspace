const prisma = require('../prismaClient');
const { getServerSocketInstance } = require("../socket/connectedUsers");

const groupChatHistoryHandler = async (socket, groupChatId) => {
    try {
        // get the group chat
        const groupChat = await prisma.groupChat.findUnique({
            where: { id: groupChatId },
            include: {
                messages: {
                    include: {
                        author: { select: { username: true, id: true } }
                    }
                }
            }
        });

        if (!groupChat) {
            return;
        }

        const io = getServerSocketInstance();

        // map messages to old structure equivalent
        const mappedMessages = groupChat.messages.map(m => ({
            _id: m.id,
            content: m.content,
            type: m.type,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
            author: { _id: m.author.id, username: m.author.username }
        }));

        // initial chat history update
        return io.to(socket.id).emit("group-chat-history", {
            messages: mappedMessages,
            groupChatId: groupChat.id,
        });

    } catch (err) {
        console.log(err);
    }
};

module.exports = groupChatHistoryHandler;

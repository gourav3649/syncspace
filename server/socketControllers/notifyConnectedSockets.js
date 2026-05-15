const prisma = require("../prismaClient");
const { getActiveConnections } = require("../socket/connectedUsers");
const  { getServerSocketInstance } = require("../socket/connectedUsers");
const { getActiveRooms } = require("../socket/activeRooms");


const updateUsersInvitations = async (userId, isNew) => {
    try {
        if ( isNew === "new" ) {
            console.log("new invitation");
        }

        // get the user's pending invitations
        const invitations = await prisma.friendInvitation.findMany({
            where: { receiverId: userId },
            include: {
                sender: { select: { username: true, email: true, id: true } }
            }
        });

        // map fields for frontend assuming older structure if needed
        const mappedInvitations = invitations.map(inv => ({
            _id: inv.id,
            senderId: {
                _id: inv.sender.id,
                username: inv.sender.username,
                email: inv.sender.email
            }
        }));

        // get the users's active socket connections(socket ids)
        const activeConnections = getActiveConnections(userId);

        // send the list of invitations to all the active connections of this user(userId)
        const io = getServerSocketInstance();

        activeConnections.forEach(socketId => {
            io.to(socketId).emit("friend-invitations", mappedInvitations);
        });
    } catch (err) {
        console.error("[updateUsersInvitations] DB error (non-fatal):", err.message);
    }
}


const updateUsersGroupChatList = async (userId) => {
    try {
        // get the user's group chat list
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                groupChats: {
                    include: {
                        participants: { select: { id: true, email: true, username: true } },
                        admin: { select: { id: true, email: true, username: true } }
                    }
                }
            }
        });

        if (!user) {
            return;
        }

        const groupChats = user.groupChats
            ? user.groupChats.map((groupChat) => {
                  return {
                      groupId: groupChat.id,
                      groupName: groupChat.name,
                      participants: groupChat.participants.map(p => ({ _id: p.id, email: p.email, username: p.username })),
                      admin: { _id: groupChat.admin.id, email: groupChat.admin.email, username: groupChat.admin.username }
                  };
              })
            : [];

        // get the users's active socket connections(socket ids)
        const activeConnections = getActiveConnections(userId);

        // send user's groupChats list to all the active connections of this user(userId)
        const io = getServerSocketInstance();

        activeConnections.forEach((socketId) => {
            io.to(socketId).emit("groupChats-list", groupChats || []);
        });
    } catch (err) {
        console.error("[updateUsersGroupChatList] DB error (non-fatal):", err.message);
    }
};


const updateUsersFriendsList = async (userId) => {
    try {
        // get the user's friends list
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                friends: { select: { username: true, email: true, id: true } }
            }
        });

        if (!user) {
            return;
        }

        const friends = user.friends
            ? user.friends.map((friend) => {
                  return {
                      id: friend.id,
                      username: friend.username,
                      email: friend.email,
                  };
              })
            : [];

        // get the users's active socket connections(socket ids)
        const activeConnections = getActiveConnections(userId);

        // send user's friends to all the active connections of this user(userId)
        const io = getServerSocketInstance();

        activeConnections.forEach((socketId) => {
            io.to(socketId).emit("friends-list", friends || []);
        });
    } catch (err) {
        console.error("[updateUsersFriendsList] DB error (non-fatal):", err.message);
    }
};



const updateChatHistory = async (conversationId, toSpecificSocketId=null) => {

    // get the conversation's chat history
    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
            messages: {
                include: {
                    author: { select: { username: true, id: true } }
                }
            },
            participants: true
        }
    });

    if (!conversation) {
        return;
    }

    const io = getServerSocketInstance();
    
    // map messages and participants to old structure equivalent
    const mappedMessages = conversation.messages.map(m => ({
        _id: m.id,
        content: m.content,
        type: m.type,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        author: { _id: m.author.id, username: m.author.username }
    }));
    
    // Client uses participants.includes(userId) — must be a flat string array
    const mappedParticipants = conversation.participants.map(p => p.id);

    if (toSpecificSocketId) {

        // initial chat history update
        return io.to(toSpecificSocketId).emit("direct-chat-history", {
            messages: mappedMessages,
            participants: mappedParticipants
        });
    }
    

    // get the participant's active socket connections(socket ids)
    conversation.participants.forEach((participant) => {
        
        const activeConnections = getActiveConnections(participant.id);

        // send the updated chat history to all the active connections of this user(participantId)
        activeConnections.forEach((socketId) => {
            io.to(socketId).emit("direct-chat-history", {
                messages: mappedMessages,
                participants: mappedParticipants
            });
        });
    })
}


const sendNewDirectMessage = async (conversationId, newMessage) => {

    // get the conversation
    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { participants: true }
    });

    const messageAuthor = await prisma.user.findUnique({ where: { id: newMessage.authorId } });

    if (!messageAuthor || !conversation) {
        return;
    }

    const message = {
        _id: newMessage.id,
        content: newMessage.content,
        createdAt: newMessage.createdAt,
        updatedAt: newMessage.updatedAt,
        type: newMessage.type,
        author: {
            _id: messageAuthor.id,
            username: messageAuthor.username,
        },
    };

    const io = getServerSocketInstance();


    // get the participant's active socket connections(socket ids)
    conversation.participants.forEach((participant) => {
        const activeConnections = getActiveConnections(participant.id);

        // send the new massage to all the active connections of this user(participantId)
        activeConnections.forEach((socketId) => {
            io.to(socketId).emit("direct-message", {
                newMessage: message,
                // Client uses participants.includes(userId) — must be a flat string array
                participants: conversation.participants.map(p => p.id),
            });
        });
    });
};


const sendNewGroupMessage = async (groupChatId, newMessage) => {

    // get the group chat
    const groupChat = await prisma.groupChat.findUnique({
        where: { id: groupChatId },
        include: { participants: true }
    });

    const messageAuthor = await prisma.user.findUnique({ where: { id: newMessage.authorId }});

    if (!messageAuthor || !groupChat) {
        return;
    }

    const message = {
        _id: newMessage.id,
        content: newMessage.content,
        createdAt: newMessage.createdAt,
        updatedAt: newMessage.updatedAt,
        type: newMessage.type,
        author: {
            _id: messageAuthor.id,
            username: messageAuthor.username,
        },
    };

    const io = getServerSocketInstance();


    // get the participant's active socket connections(socket ids)
    groupChat.participants.forEach((participant) => {
        const activeConnections = getActiveConnections(participant.id);

        // send the new massage to all the active connections of this user(participantId)
        activeConnections.forEach((socketId) => {
            io.to(socketId).emit("group-message", {
                newMessage: message,
                groupChatId: groupChat.id,
            });
        });
    });
};


const updateRooms = (toSpecifiedSocketId = null) => {
    const io = getServerSocketInstance();
    const activeRooms = getActiveRooms();

    if (toSpecifiedSocketId) {
        io.to(toSpecifiedSocketId).emit("active-rooms", {
            activeRooms,
        });
    } else {
        io.emit("active-rooms", {
            activeRooms,
        });
    }
};


const initialRoomsUpdate = async (userId, socketId) => {

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { friends: { select: { id: true } } }
    });

    if (!user) {
        return;
    }

    const io = getServerSocketInstance();
    const activeRooms = getActiveRooms();

    const friendIds = new Set(user.friends.map((f) => f.id));
    const rooms = [];

    activeRooms.forEach((room) => {
        const isRoomCreatedByMe = room.roomCreator.userId === userId;

        if (isRoomCreatedByMe) {
            rooms.push(room);
        } else if (friendIds.has(room.roomCreator.userId)) {
            rooms.push(room);
        }
    });

    io.to(socketId).emit("active-rooms-initial", {
        activeRooms: rooms
    });

};



module.exports = {
    updateUsersInvitations,
    updateUsersFriendsList,
    updateUsersGroupChatList,
    updateChatHistory,
    sendNewDirectMessage,
    sendNewGroupMessage,
    updateRooms,
    initialRoomsUpdate
}
import { io, Socket } from 'socket.io-client';
import {
  setFriends,
  setGroupChatList,
  setOnlineUsers,
  setPendingInvitations,
} from '../actions/friendActions';
import {
  addNewMessage,
  setInitialTypingStatus,
  setMessages,
  setTyping,
} from '../actions/chatActions';
import { ActiveRoom, Message } from '../actions/types';
import { store } from '../store';
import {
  setCallRequest,
  setCallStatus,
  setOtherUserId,
  setRemoteStream,
  clearVideoChat,
  setAudioOnly,
} from '../actions/videoChatActions';
import {
  getLocalStreamPreview,
  handleParticipantLeftRoom,
  handleSignalingData,
  newPeerConnection,
  prepareNewPeerConnection,
} from './webRTC';
import SimplePeer from 'simple-peer';
import {
  initialRoomsUpdate,
  newRoomCreated,
  updateActiveRooms,
} from './roomHandler';

export interface UserDetails {
  email: string;
  token: string;
  username: string;
}

interface PendingInvitation {
  _id: string;
  senderId: {
    username: string;
    email: string;
    _id: string;
  };
}

interface Friend {
  id: string;
  username: string;
  email: string;
}

interface OnlineUser {
  userId: string;
  socketId: string;
}

interface GroupChatDetails {
  groupId: string;
  groupName: string;
  participants: Array<{
    _id: string;
    username: string;
    email: string;
  }>;
  admin: {
    _id: string;
    username: string;
    email: string;
  };
}

interface ServerToClientEvents {
  'friend-invitations': (data: Array<PendingInvitation>) => void;
  'friends-list': (data: Array<Friend>) => void;
  'online-users': (data: Array<OnlineUser>) => void;
  'groupChats-list': (data: Array<GroupChatDetails>) => void;
  'direct-message': (data: { newMessage: Message; participants: Array<string> }) => void;
  'group-message': (data: { newMessage: Message; groupChatId: string }) => void;
  'direct-chat-history': (data: { messages: Array<Message>; participants: Array<string> }) => void;
  'group-chat-history': (data: { messages: Array<Message>; groupChatId: string }) => void;
  'notify-typing': (data: { senderUserId: string; typing: boolean }) => void;
  'call-request': (data: { callerName: string; audioOnly: boolean; callerUserId: string; signal: SimplePeer.SignalData }) => void;
  'call-response': (data: { otherUserId: string; accepted: boolean; signal: SimplePeer.SignalData }) => void;
  'notify-chat-left': () => void;
  'room-create': (data: { roomDetails: ActiveRoom }) => void;
  'active-rooms': (data: { activeRooms: ActiveRoom[] }) => void;
  'active-rooms-initial': (data: { activeRooms: ActiveRoom[] }) => void;
  'conn-prepare': (data: { connUserSocketId: string }) => void;
  'conn-init': (data: { connUserSocketId: string }) => void;
  'conn-signal': (data: { connUserSocketId: string; signal: SimplePeer.SignalData }) => void;
  'room-participant-left': (data: { connUserSocketId: string }) => void;
}

interface ClientToServerEvents {
  helloFomClient: () => void;
  'direct-message': (data: { message: string; receiverUserId: string }) => void;
  'group-message': (data: { message: string; groupChatId: string }) => void;
  'direct-chat-history': (data: { receiverUserId: string }) => void;
  'group-chat-history': (data: { groupChatId: string }) => void;
  'notify-typing': (data: { receiverUserId: string; typing: boolean }) => void;
  'call-request': (data: { receiverUserId: string; callerName: string; audioOnly: boolean; signal: SimplePeer.SignalData }) => void;
  'call-response': (data: { receiverUserId: string; accepted: boolean; signal?: SimplePeer.SignalData }) => void;
  'notify-chat-left': (data: { receiverUserId: string }) => void;
  'room-create': () => void;
  'room-join': (data: { roomId: string }) => void;
  'room-leave': (data: { roomId: string }) => void;
  'conn-signal': (data: { signal: SimplePeer.SignalData; connUserSocketId: string }) => void;
  'conn-init': (data: { connUserSocketId: string }) => void;
}

let currentPeerConnection: any = null;

const setCurrentPeerConnection = (peerConnection: any) => {
  currentPeerConnection = peerConnection;
};

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

const SERVER_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Inject a synthetic "call event" message into the active chat store.
 * This shows call history in the chat area (declined, ended, etc.)
 */
const injectCallMessage = (content: string, otherUsername: string, otherUserId: string) => {
  const state = store.getState();
  const myId = (state.auth.userDetails as any)?._id;
  const chosenChat = state.chat.chosenChatDetails;

  // Only inject if we're currently in the chat with that person
  if (!chosenChat || chosenChat.userId !== otherUserId) return;

  const syntheticMessage: Message = {
    _id: `call-msg-${Date.now()}`,
    content,
    author: {
      // Attribute to a system "author" using otherUserId so it appears as incoming
      username: otherUsername,
      _id: otherUserId,
    },
    createdAt: new Date().toISOString(),
  };

  store.dispatch(addNewMessage(syntheticMessage) as any);
};

const connectWithSocketServer = (userDetails: UserDetails) => {
  socket = io(SERVER_URL, {
    auth: { token: userDetails.token },
  });

  socket.on('connect', () => {
    console.log(`Connected to socket.io. Socket ID: ${socket.id}`);
  });

  socket.emit('helloFomClient');

  socket.on('friend-invitations', (data) => {
    store.dispatch(setPendingInvitations(data) as any);
  });

  socket.on('friends-list', (data) => {
    const typingStatus = data.map((f) => ({ userId: f.id, typing: false }));
    store.dispatch(setInitialTypingStatus(typingStatus));
    store.dispatch(setFriends(data) as any);
  });

  socket.on('online-users', (data) => {
    store.dispatch(setOnlineUsers(data) as any);
  });

  socket.on('groupChats-list', (data) => {
    store.dispatch(setGroupChatList(data) as any);
  });

  socket.on('direct-chat-history', (data) => {
    const { messages, participants } = data;
    const chatDetails = store.getState().chat.chosenChatDetails;
    if (chatDetails) {
      const receiverId = chatDetails.userId;
      const senderId = (store.getState().auth.userDetails as any)._id;
      if (participants.includes(receiverId) && participants.includes(senderId)) {
        store.dispatch(setMessages(messages) as any);
      }
    }
  });

  socket.on('group-chat-history', (data) => {
    const { messages, groupChatId } = data;
    const groupChatDetails = store.getState().chat.chosenGroupChatDetails;
    if (groupChatDetails?.groupId === groupChatId) {
      store.dispatch(setMessages(messages) as any);
    }
  });

  socket.on('direct-message', (data) => {
    const { newMessage, participants } = data;
    const chatDetails = store.getState().chat.chosenChatDetails;
    if (chatDetails) {
      const receiverId = chatDetails.userId;
      const senderId = (store.getState().auth.userDetails as any)._id;
      if (participants.includes(receiverId) && participants.includes(senderId)) {
        store.dispatch(addNewMessage(newMessage) as any);
      }
    }
  });

  socket.on('group-message', (data) => {
    const { newMessage, groupChatId } = data;
    const chatDetails = store.getState().chat.chosenGroupChatDetails;
    if (chatDetails?.groupId === groupChatId) {
      store.dispatch(addNewMessage(newMessage) as any);
    }
  });

  socket.on('notify-typing', (data) => {
    store.dispatch(setTyping({ typing: data.typing, userId: data.senderUserId }) as any);
  });

  socket.on('call-request', (data) => {
    store.dispatch(setCallRequest(data) as any);
  });

  socket.on('notify-chat-left', () => {
    store.dispatch(clearVideoChat('User left the call') as any);
  });

  // rooms
  socket.on('room-create', (data) => { newRoomCreated(data); });
  socket.on('active-rooms', (data) => { updateActiveRooms(data); });
  socket.on('active-rooms-initial', (data) => { initialRoomsUpdate(data); });

  socket.on('conn-prepare', (data) => {
    prepareNewPeerConnection(data.connUserSocketId, false);
    socket.emit('conn-init', { connUserSocketId: data.connUserSocketId });
  });

  socket.on('conn-init', (data) => {
    prepareNewPeerConnection(data.connUserSocketId, true);
  });

  socket.on('conn-signal', (data) => { handleSignalingData(data); });

  socket.on('room-participant-left', (data) => { handleParticipantLeftRoom(data); });
};

const sendDirectMessage = (data: { message: string; receiverUserId: string }) => {
  socket.emit('direct-message', data);
};

const sendGroupMessage = (data: { message: string; groupChatId: string }) => {
  socket.emit('group-message', data);
};

const fetchDirectChatHistory = (data: { receiverUserId: string }) => {
  socket.emit('direct-chat-history', data);
};

const fetchGroupChatHistory = (data: { groupChatId: string }) => {
  socket.emit('group-chat-history', data);
};

const notifyTyping = (data: { receiverUserId: string; typing: boolean }) => {
  socket.emit('notify-typing', data);
};

const callRequest = (data: {
  receiverUserId: string;
  callerName: string;
  audioOnly: boolean;
}) => {
  const peerConnection = () => {
    const peer = newPeerConnection(true);
    currentPeerConnection = peer;

    peer.on('signal', (signal) => {
      socket.emit('call-request', { ...data, signal });
    });

    peer.on('stream', (stream) => {
      store.dispatch(setRemoteStream(stream) as any);
    });

    // Listen for call response (accept or reject)
    socket.on('call-response', (responseData) => {
      if (responseData.accepted) {
        // ✅ Accepted — connect peer
        store.dispatch(setCallStatus('accepted') as any);
        store.dispatch(setOtherUserId(responseData.otherUserId) as any);
        if (responseData.signal) {
          peer.signal(responseData.signal);
        }
      } else {
        // ❌ Rejected — clear call state on caller side immediately
        store.dispatch(setCallStatus('rejected') as any);

        // Find the receiver's username from friends list
        const friends = store.getState().friends.friends;
        const receiver = friends.find((f: any) => f.id === data.receiverUserId);
        const receiverName = receiver?.username ?? 'User';

        // Show in-chat message
        injectCallMessage(
          `📵 ${receiverName} declined your ${data.audioOnly ? 'voice' : 'video'} call`,
          receiverName,
          data.receiverUserId
        );

        // Auto-clear the rejected state after 2 seconds
        setTimeout(() => {
          store.dispatch(clearVideoChat('') as any);
        }, 2000);
      }
    });
  };

  getLocalStreamPreview(data.audioOnly, () => {
    peerConnection();
    store.dispatch(setCallStatus('ringing') as any);
    store.dispatch(setAudioOnly(data.audioOnly) as any);
  });
};

const callResponse = (data: {
  receiverUserId: string;
  accepted: boolean;
  audioOnly: boolean;
}) => {
  socket.emit('call-response', data);

  if (!data.accepted) {
    // Receiver declined — clear their incoming call UI
    store.dispatch(setCallRequest(null) as any);

    // Show declined message in their own chat too
    const friends = store.getState().friends.friends;
    const caller = friends.find((f: any) => f.id === data.receiverUserId);
    const callerName = caller?.username ?? 'User';

    injectCallMessage(
      `📵 You declined ${callerName}'s ${data.audioOnly ? 'voice' : 'video'} call`,
      callerName,
      data.receiverUserId
    );
    return;
  }

  // Accepted — set up peer connection
  const peerConnection = () => {
    const peer = newPeerConnection(false);
    currentPeerConnection = peer;

    peer.on('signal', (signal) => {
      socket.emit('call-response', { ...data, signal });
    });

    peer.on('stream', (stream) => {
      store.dispatch(setRemoteStream(stream) as any);
    });

    peer.signal(store.getState().videoChat.callRequest?.signal!);
  };

  getLocalStreamPreview(data.audioOnly, () => {
    peerConnection();
    store.dispatch(setCallRequest(null) as any);
    store.dispatch(setAudioOnly(data.audioOnly) as any);
  });
};

const notifyChatLeft = (receiverUserId: string) => {
  socket.emit('notify-chat-left', { receiverUserId });
};

const createNewRoom = () => { socket.emit('room-create'); };
const joinRoom = (data: { roomId: string }) => { socket.emit('room-join', data); };
const leaveRoom = (data: { roomId: string }) => { socket.emit('room-leave', data); };

const signalPeerData = (data: { signal: SimplePeer.SignalData; connUserSocketId: string }) => {
  socket.emit('conn-signal', data);
};

export {
  connectWithSocketServer,
  sendDirectMessage,
  fetchDirectChatHistory,
  notifyTyping,
  callRequest,
  callResponse,
  notifyChatLeft,
  currentPeerConnection,
  setCurrentPeerConnection,
  sendGroupMessage,
  fetchGroupChatHistory,
  createNewRoom,
  joinRoom,
  leaveRoom,
  signalPeerData,
};

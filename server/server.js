require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
var webPush = require('web-push');

const authRoutes = require('./routes/authRoutes');
const friendInvitationRoutes = require('./routes/friendInvitationRoutes');
const groupChatRoutes = require('./routes/groupChatRoutes');

const { createSocketServer } = require('./socket/socketServer');

const PORT = process.env.PORT || 5000;

// const vapidKeys = webPush.generateVAPIDKeys();
// console.log(vapidKeys.publicKey); // Used in the frontend
// console.log(vapidKeys.privateKey); // Kept secret on your server
// console.log(JSON.stringify(vapidKeys));

webPush.setVapidDetails(
  process.env.WEB_PUSH_CONTACT,
  process.env.PUBLIC_VAPID_KEY, // vapidKeys.publicKey,
  process.env.PRIVATE_VAPID_KEY // vapidKeys.privateKey
);

const app = express();
app.use(express.json());
app.use(cors());

// register the routes
app.use('/api/auth', authRoutes);
app.use('/api/invite-friend', friendInvitationRoutes);
app.use('/api/group-chat', groupChatRoutes);

const server = http.createServer(app);

// socket connection
createSocketServer(server);

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

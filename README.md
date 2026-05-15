# SyncSpace

WebRTC based peer-to-peer video calling and messaging web app.

# Libraries Used

- **`React`** for the frontend
- **`Socket.io`** as signaling server and real-time communication
- **`simple-peer`** for peer-to-peer WebRTC connections
- **`Express`** as server
- **`PostgreSQL` & `Prisma`** for relational data persistence
- **`Material UI`** for creating UI components
- **`Redux`** for state management
- **`TypeScript`** for type safety

# Features

- User authentication and authorization
- Private Audio and Video Chat
- Messaging with database storage
- Send, accept, and reject friend invitations
- Online status indicators
- Notify on typing indicator
- Screen sharing (with correct scaling)
- Accept and reject incoming calls
- Collapsible desktop sidebar for a cleaner UI

## New Features Added Recently

- **`Group Chats`**: Create group chats like WhatsApp. Group Admins can add members and participants can leave the group.
- **`Unfriend`**: Ability to remove a friend.
- **`SyncSpace Spaces`**: Host a space and any of your friends can join. Implemented using MESH topology to establish a peer-to-peer network between every client.
- **`Push Notifications`**: For incoming calls, messages, and friend requests.

# Installation

1. Clone project:

```bash
git clone https://github.com/gourav3649/syncspace.git
```

## Manual Setup

### Backend (Server)

```bash
cd server
npm install
npx prisma generate
```

**Required Environment Variables (`server/.env`):**

- `DATABASE_URL`: Your PostgreSQL connection string (e.g., Neon Postgres)
- `JWT_SECRET`: Secret for generating JSON Web Tokens
- `WEB_PUSH_CONTACT`: e.g. `mailto:youremail@example.com`
- `PUBLIC_VAPID_KEY`: Your VAPID public key
- `PRIVATE_VAPID_KEY`: Your VAPID private key

To run the development server:

```bash
npm run dev
```

### Frontend (Client)

```bash
cd client
npm install
```

**Optional Environment Variables (`client/.env`):**

- `REACT_APP_API_URL`: Your backend API URL (defaults to `http://localhost:5000` if not set)

To start the React development server:

```bash
npm start
```

# Deployment

Because Socket.io requires stateful, long-running connections (WebSockets), Vercel's Serverless Functions are not recommended for the backend. We recommend splitting the deployment:

### 1. Deploy the Backend (e.g., Render or Railway)
- Create a new Web Service pointing to the `server` directory.
- **Build Command**: `npm install && npx prisma generate`
- **Start Command**: `npm start`
- Add your environment variables (`DATABASE_URL`, `JWT_SECRET`, and VAPID keys).

### 2. Deploy the Frontend (Vercel)
- Create a new Project pointing to the `client` directory.
- Set the `REACT_APP_API_URL` environment variable to your deployed backend URL.
- Set `CI=false` in the Vercel Environment Variables to prevent ESLint warnings from failing the build.

# Docker

Running the project through Docker is recommended for quick setup. Just one command and the project is up and running!

```bash
docker-compose up --build
```

*Make sure you have Docker installed and the required environment variables configured.*

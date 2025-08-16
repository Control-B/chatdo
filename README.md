# ChatDO - Slack-like Messaging Platform

A modern, real-time messaging platform built with Next.js, Express, Socket.IO, and PostgreSQL. Deployable on DigitalOcean App Platform.

## 🚀 Features

- **Real-time messaging** with Socket.IO and Redis adapter
- **Workspace management** with role-based access control
- **Public and private channels**
- **Direct messaging** with thread support
- **File uploads** via DigitalOcean Spaces
- **Typing indicators** and read receipts
- **User presence** and status updates
- **Message threads** and replies
- **Search functionality**
- **PWA support** with mobile optimization
- **Horizontal scaling** with Redis and sticky sessions

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  Express API    │    │   PostgreSQL    │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│     Redis       │◄─────────────┘
                        │  (Socket.IO)    │
                        └─────────────────┘
                                │
                        ┌─────────────────┐
                        │ DigitalOcean    │
                        │    Spaces       │
                        │  (File Storage) │
                        └─────────────────┘
```

## 📦 Tech Stack

### Frontend

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **Zustand** for state management
- **Socket.IO Client** for real-time
- **React Query** for data fetching
- **NextAuth.js** for authentication

### Backend

- **Node.js 20** with Express
- **Socket.IO v4** with Redis adapter
- **Prisma ORM** with PostgreSQL
- **Redis** for session management
- **JWT** for authentication
- **DigitalOcean Spaces** for file storage
- **Pino** for logging

### Infrastructure

- **DigitalOcean App Platform** for deployment
- **PostgreSQL** managed database
- **Redis** managed database
- **Docker** for containerization

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL (local or managed)
- Redis (local or managed)
- DigitalOcean account (for Spaces)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ChatDO
pnpm install
```

### 2. Environment Setup

Copy the environment example files:

```bash
cp apps/api/env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Update the environment variables:

```bash
# apps/api/.env
DATABASE_URL="postgresql://username:password@localhost:5432/chatdo"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key-here"
SPACES_KEY="your-spaces-access-key"
SPACES_SECRET="your-spaces-secret-key"
SPACES_REGION="nyc3"
SPACES_BUCKET="chatdo-files"
CORS_ORIGIN="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm --filter api db:generate

# Run migrations
pnpm db:migrate

# Seed with demo data
pnpm db:seed
```

### 4. Start Development Servers

```bash
# Start both API and web servers
pnpm dev

# Or start individually
pnpm --filter api dev
pnpm --filter web dev
```

The application will be available at:

- Frontend: http://localhost:3000
- API: http://localhost:3001
- Health check: http://localhost:3001/healthz

## 🚀 Production Deployment

### DigitalOcean App Platform

1. **Create DigitalOcean Resources**:

   - PostgreSQL database cluster
   - Redis database cluster
   - Spaces bucket for file storage

2. **Update App Configuration**:

   - Edit `.do/app.yaml` with your repository details
   - Update environment variables with your DigitalOcean resource URLs

3. **Deploy**:
   ```bash
   doctl apps create --spec .do/app.yaml
   ```

### Environment Variables for Production

```bash
# Database
DATABASE_URL="postgresql://doadmin:password@db-cluster.ondigitalocean.com:25060/chatdo?sslmode=require"

# Redis
REDIS_URL="redis://doadmin:password@redis-cluster.ondigitalocean.com:25061"

# JWT
JWT_SECRET="your-production-jwt-secret"

# DigitalOcean Spaces
SPACES_KEY="your-spaces-access-key"
SPACES_SECRET="your-spaces-secret-key"
SPACES_REGION="nyc3"
SPACES_BUCKET="your-bucket-name"

# CORS
CORS_ORIGIN="https://your-app-url.ondigitalocean.app"
```

## 📱 Demo Data

After running the seed script, you'll have:

- **3 demo users**:

  - alice@example.com / password123 (Owner)
  - bob@example.com / password123 (Admin)
  - charlie@example.com / password123 (Member)

- **1 demo workspace** with:
  - General channel (public)
  - Random channel (public)
  - Private admin channel
  - DM thread between Alice and Bob

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Workspaces

- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces/my` - Get user's workspaces
- `GET /api/workspaces/:id` - Get workspace details
- `PUT /api/workspaces/:id` - Update workspace

### Channels

- `POST /api/workspaces/:id/channels` - Create channel
- `GET /api/channels/:id` - Get channel details
- `PUT /api/channels/:id` - Update channel
- `POST /api/channels/:id/join` - Join channel
- `POST /api/channels/:id/leave` - Leave channel

### Messages

- `GET /api/messages?roomId=...` - Get messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id` - Edit message
- `DELETE /api/messages/:id` - Delete message

### File Uploads

- `POST /api/uploads/:workspaceId/presign` - Get presigned URL
- `GET /api/uploads/:workspaceId/files` - List files
- `DELETE /api/uploads/files/:id` - Delete file

## 🔌 Socket.IO Events

### Client to Server

- `join_workspace` - Join workspace namespace
- `join_room` - Join channel or DM
- `leave_room` - Leave room
- `message_send` - Send message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator
- `receipt_ack` - Acknowledge message read
- `presence_ping` - Update presence status

### Server to Client

- `message_new` - New message received
- `message_edit` - Message edited
- `message_delete` - Message deleted
- `typing` - User typing indicator
- `presence` - User presence update
- `receipt_update` - Read receipt update
- `room_user_count` - Room user count update

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run linting
pnpm lint

# Type checking
pnpm --filter api build
pnpm --filter web build
```

## 📊 Monitoring

- **Health checks**: `/healthz` endpoint
- **Logging**: Structured JSON logs with Pino
- **Metrics**: Basic Prometheus metrics (to be implemented)
- **Error tracking**: Sentry integration (to be implemented)

## 🔒 Security Features

- **JWT authentication** with secure tokens
- **Role-based access control** (Owner, Admin, Member)
- **Rate limiting** on API endpoints
- **CORS protection** with configurable origins
- **Input validation** with Zod schemas
- **SQL injection protection** with Prisma ORM
- **XSS protection** with Helmet.js

## 🚀 Performance Optimizations

- **Redis adapter** for Socket.IO horizontal scaling
- **Database indexing** on frequently queried fields
- **Message pagination** with cursor-based pagination
- **File upload optimization** with presigned URLs
- **CDN integration** with DigitalOcean Spaces
- **Sticky sessions** for Socket.IO connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the demo data for examples

## 🎯 Roadmap

- [ ] Message reactions and emoji picker
- [ ] Slash commands (/giphy, /poll, etc.)
- [ ] Webhook integrations
- [ ] Advanced search with filters
- [ ] Message threading improvements
- [ ] Mobile app (React Native)
- [ ] Video/audio calls
- [ ] Advanced admin features
- [ ] Analytics dashboard

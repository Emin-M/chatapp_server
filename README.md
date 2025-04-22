# Chat Application Server

A robust and scalable chat application server built with NestJS, PostgreSQL, and Prisma ORM. This server provides real-time messaging capabilities with authentication, user management, and more.

## Features

- 🔐 JWT-based authentication
- 💬 Real-time messaging
- 📧 Email notifications
- 📊 PostgreSQL database with Prisma ORM
- 📝 Swagger API documentation
- 🧪 Comprehensive testing setup
- 🐳 Docker support
- ☸️ Kubernetes deployment ready

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker and Docker Compose
- PostgreSQL
- Kubernetes (for production deployment)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chatapp_server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chatdb"
JWT_SECRET="your-super-secret-key-here"
JWT_EXPIRATION="1d"
PORT=5000
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

## Development

Start the development server:
```bash
npm run start:dev
```

The server will be running at `http://localhost:5001`

## API Documentation

Once the server is running, you can access the Swagger API documentation at:
```
http://localhost:5000/api
```

## Testing

Run the test suite:
```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Docker Deployment

1. Build the Docker image:
```bash
docker build -t chatapp-server .
```

2. Run with Docker Compose:
```bash
docker-compose up
```

## Kubernetes Deployment

The project includes Kubernetes manifests for deployment:

- `deployment.yaml`: Main application deployment
- `service.yaml`: Service definition
- `postgres.yaml`: PostgreSQL deployment
- `migration-job.yaml`: Database migration job

To deploy to Kubernetes:
```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f postgres.yaml
kubectl apply -f migration-job.yaml
```

## Project Structure

```
src/
├── auth/           # Authentication module
├── users/          # User management
├── messages/       # Message handling
├── prisma/         # Database schema and migrations
└── main.ts         # Application entry point
```

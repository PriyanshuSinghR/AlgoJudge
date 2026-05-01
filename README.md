# AlgoJudge

AlgoJudge is a full-stack coding judge platform where users can solve programming problems, run code, submit solutions, track submissions, and get AI-powered hints or code explanations.

It has a React frontend and an Express backend. The backend connects to MongoDB and uses Docker to run code safely for C++, Python, JavaScript, and Java.

## Features

- User signup, signin, profile update, and protected pages
- Browse, create, edit, and delete coding problems
- Monaco-based code editor
- Run code with custom input
- Submit solutions against saved test cases
- Store recent submission history
- AI hints and code explanations
- Support for C++, Python, JavaScript, and Java

## Tech Stack

**Frontend**

- React
- Vite
- React Router
- TanStack Query
- Axios
- Monaco Editor
- Tailwind CSS

**Backend**

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Docker
- Google GenAI SDK

## Quick Start

First create your env files from the examples:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Now update `client/.env` and `server/.env` with your own values.

## Start Backend

Use this method for the complete backend, including code execution.

```bash
cd server
```

Build the language runner images:

```bash
docker build -t oj-cpp -f docker/cpp.Dockerfile .
docker build -t oj-python -f docker/python.Dockerfile .
docker build -t oj-node -f docker/node.Dockerfile .
docker build -t oj-java -f docker/java.Dockerfile .
```

Start the backend container:

```bash
docker compose up --build
```

Backend runs at:

```text
http://localhost:8000
```

For normal backend development without Docker Compose, you can run:

```bash
cd server
npm install
npm run dev
```

This starts Express directly, but Docker Compose is better for the compiler flow because the judge uses Docker volumes and isolated runner containers.

## Start Frontend

Open a new terminal and run:

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

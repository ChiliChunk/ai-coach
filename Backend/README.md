# AI Coach Backend

Backend API built with Node.js, TypeScript, and Express.

## Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── app.ts          # Express app configuration
│   └── index.ts        # Entry point
├── .env.example        # Environment variables example
├── .gitignore
├── package.json
└── tsconfig.json
```

## Installation

```bash
cd backend
npm install
```

## Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the values in `.env` as needed.

## Development

Start the development server:

```bash
npm run dev
```

## Build

Build the TypeScript code:

```bash
npm run build
```

## Production

Start the production server:

```bash
npm start
```

## API Endpoints

### Health Check
- **GET** `/api/v1/health` - Check server status

## Features

- TypeScript for type safety
- Express.js web framework
- CORS enabled
- Helmet for security headers
- Morgan for logging
- Compression middleware
- Error handling middleware
- Hot reload in development
- Environment-based configuration

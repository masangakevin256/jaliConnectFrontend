# Jali Connect Frontend

A production-ready mental health support platform built with React, Vite, and TypeScript.

## Features

- Complete authentication system with JWT
- Role-based access control (User, Counselor, Admin)
- Three separate dashboards with specialized modules
- Real-time messaging with Socket.io
- Responsive Bootstrap UI
- Mental health-focused design

## Tech Stack

- React 18 + Vite
- TypeScript
- Bootstrap 5
- React Router v6
- Axios
- Socket.io-client
- Recharts for data visualization
- React Hot Toast for notifications

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── api/              # API service configuration
├── context/          # React Context for global state
├── hooks/            # Custom React hooks
├── components/       # Reusable UI components
├── pages/            # Page components
├── types/            # TypeScript type definitions
├── services/         # Business logic services
└── main.tsx         # Application entry point
```

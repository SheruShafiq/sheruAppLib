# Sheru's Next.js Project

This is a Next.js conversion of the original Vite/React project.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app` - Contains all the Next.js app router pages and layouts
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions, API calls, and type definitions
- `/src/hooks` - Custom React hooks

## Features

- Modern React application using Next.js
- App Router for improved routing and layouts
- MUI (Material-UI) for styling
- PWA support
- Authentication system
- Dynamic data fetching

## Backend Integration

The app connects to a JSON-server backend. Make sure the backend is running on the port specified in the `.env` file.

## Deployment

This project can be deployed on platforms like Vercel, Netlify, or any other service that supports Next.js applications.

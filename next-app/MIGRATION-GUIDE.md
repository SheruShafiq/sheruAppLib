# Next.js Migration Guide

This document provides guidance on how to continue migrating the remaining components from the Vite/React application to Next.js.

## Components to Migrate

1. **UI Components**
   - PostPreview
   - CommentBlock
   - CreatePostDialogue
   - Custom snackbars
   - Other UI elements

2. **3D Components**
   - Ensure all Three.js components are properly set up for client-side rendering using dynamic imports with `ssr: false`

3. **Page Functionality**
   - Implement post creation, viewing, and interaction
   - Implement comments system
   - Implement user profile functionality
   - Implement Badge Maker app

## Migration Tips

### Client Components vs Server Components

- UI components that use React hooks or browser APIs should be marked as 'use client'
- Components that only render static content can be server components
- For data fetching, consider using Next.js's new data fetching methods like `getServerSideProps` or React Server Components

### Routing

- Next.js App Router uses file-based routing with directories
- Dynamic routes use [parameter] syntax in folder names
- Page components should export a default function

### API Integration

- Backend API calls can be centralized in the `/lib/api.ts` file
- For server-side only operations, consider moving logic to Route Handlers in the `/app/api` directory

### Authentication

- The AuthProvider component handles authentication state
- Consider enhancing it with server-side session management via Next.js middleware

## Recommended Approach

1. Migrate one functional area at a time (e.g., Sauce, Posts, Comments)
2. Test each area thoroughly before moving on
3. Update shared components as needed
4. Maintain TypeScript types for all components and data structures

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [React Server Components](https://nextjs.org/docs/getting-started/react-essentials#server-components)

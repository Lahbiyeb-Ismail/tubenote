# TubeNote Client

The TubeNote client is a Next.js application that provides the user interface for watching videos and taking notes simultaneously.

## Technologies

- **Next.js 14** - React framework with server-side rendering
- **TypeScript** - Typed JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and state management
- **React Hook Form** - Form handling with validation
- **BlockNote** - Rich text editor for note-taking
- **React YouTube** - YouTube video player integration
- **Zod** - Schema validation

## Features

- Video player with synchronized note-taking
- User authentication (login, registration, Google OAuth)
- Dashboard to view and manage notes
- PDF export for notes
- Responsive design for desktop and mobile use

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm (v8 or later)

### Development

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create an `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable UI components
- `src/features/` - Feature-specific code by domain
- `src/helpers/` - Helper functions
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility libraries and configuration

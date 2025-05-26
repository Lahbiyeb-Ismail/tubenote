# TubeNote Client

<div align="center">
  <img src="./public/images/logo.png" alt="TubeNote Logo" width="200" />
  
  <p><strong>Take notes while watching YouTube videos</strong></p>
  
  ![License](https://img.shields.io/github/license/ismail/tubenote)
  ![Next.js](https://img.shields.io/badge/Next.js-15.3.2-blue)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
</div>

## 📋 Overview

TubeNote is a modern web application that enables users to watch YouTube videos and take synchronized notes in the same interface. Perfect for students, researchers, and content creators who need to document insights while watching videos.

## ✨ Features

- **Video Integration**: Seamless YouTube video playback with timestamp synchronization
- **Note Taking**: Rich text editor with real-time saving and timestamp marking
- **User Authentication**: Secure login/registration system with Google OAuth support
- **Dashboard**: Organized view of all notes with filtering and search capabilities
- **Export**: Export notes to PDF for offline reference
- **Responsive Design**: Fully optimized for both desktop and mobile experiences
- **Route Protection**: Server-side middleware and client-side authentication guards

## 🛠️ Technologies

- **Frontend Framework**: [Next.js 15](https://nextjs.org/) - React framework with App Router
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/) - Static type checking
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **State Management**: 
  - [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight state management
  - [TanStack Query](https://tanstack.com/query/latest) - Data fetching and caching
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Rich Text Editing**: [BlockNote](https://www.blocknotejs.org/) - Modern rich text editor
- **Video Player**: [React YouTube](https://github.com/tjallingt/react-youtube) - YouTube player component
- **Authentication**: JWT with HTTP-only cookies and middleware protection

## 📦 Project Structure

```
src/
├── app/                  # Next.js App Router pages and layouts
│   ├── (auth)/           # Authentication routes (login, register)
│   ├── (dashboards)/     # Protected dashboard routes
│   └── layout.tsx        # Root layout with providers
├── components/           # Shared UI components
├── features/             # Feature modules by domain
│   ├── auth/             # Authentication related code
│   ├── note/             # Note management
│   ├── user/             # User profile and settings
│   └── video/            # Video player and related functionality
├── HOC/                  # Higher-Order Components
├── middleware.ts         # Next.js middleware for route protection
├── providers/            # React context providers
└── stores/               # Zustand state stores
```

## 🚀 Getting Started

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
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

Run tests with:

```bash
pnpm test
```

## 🏗️ Build

Create a production build:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

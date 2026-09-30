# LearnSphere — Full Stack Course Management Application

## Problem Statement

In today's fast-paced digital world, access to structured, high-quality online education is critical for career growth and skill development. However, many existing platforms are either too complex, lack personalization, or fail to provide a seamless learning experience. **LearnSphere** solves this by offering a clean, intuitive course management platform where students can browse courses, enroll, track their progress, and manage their learning journey — all in one place.

## Target User Requirements

| User Type | Needs |
|-----------|-------|
| **Students** | Browse and search courses by category/level, enroll with one click, track progress on a personal dashboard, and manage their account. |
| **Visitors** | Explore the platform via a landing page, register for a free account, and log in securely. |
| **All Users** | A responsive, accessible interface that works flawlessly across desktop, tablet, and mobile devices. |

## Features List

### 1. Landing Page (Home)
- Hero section with platform introduction and call-to-action buttons
- Statistics showcase (courses, students, instructors, completion rate)
- Feature highlights grid (curated curriculum, progress tracking, certificates, community)
- Featured courses preview
- Registration call-to-action banner

### 2. Authentication
- **Login Page** with client-side validation:
  - Email format validation
  - Password length validation (minimum 6 characters)
  - Required field checks with inline error messages
- **Registration Page** with client-side validation:
  - Full name (minimum 2 characters)
  - Email format validation
  - Password (minimum 8 characters)
  - Password confirmation matching
  - Show/hide password toggle
- Success feedback and automatic redirect to dashboard

### 3. Student Dashboard
- Personalized welcome message
- Learning statistics overview (enrolled, completed, hours, certificates)
- "Continue Learning" section with progress bars for enrolled courses
- "Recommended for You" section with one-click enrollment

### 4. Course Listings
- Full course catalog with search functionality
- Filter by category and skill level
- Responsive course cards with ratings, student count, duration, and price
- Empty state with clear filters action

### 5. Navigation & Auth State
- Dynamic navbar that shows Login/Register for guests and Logout for authenticated users
- User avatar with initials when logged in
- Mobile-responsive hamburger menu with slide-down panel
- Scroll-aware navbar (transparent to solid on scroll)
- React Context-based auth state management with localStorage persistence

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 18 with TypeScript |
| **Build Tool** | Vite 5 |
| **Routing** | React Router DOM v6 |
| **Styling** | Tailwind CSS 3 with custom design system |
| **Icons** | Lucide React |
| **State Management** | React Context API + useState |
| **Fonts** | Inter (body) + Plus Jakarta Sans (display) |
| **Linting** | ESLint with TypeScript-ESLint |

## Folder Structure

```
learnsphere/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind theme configuration
├── postcss.config.js           # PostCSS configuration
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config (root)
├── tsconfig.app.json           # TypeScript config (app)
├── tsconfig.node.json          # TypeScript config (node)
├── eslint.config.js            # ESLint configuration
├── README.md                   # This file
└── src/
    ├── main.tsx                # React entry point
    ├── App.tsx                 # Root component with router setup
    ├── index.css               # Global styles + Tailwind layers
    ├── vite-env.d.ts           # Vite type declarations
    ├── components/             # Reusable UI components
    │   ├── Navbar.tsx          # Top navigation bar (auth-aware)
    │   ├── Footer.tsx          # Site footer
    │   ├── CourseCard.tsx       # Reusable course display card
    │   ├── Layout.tsx          # Page layout wrapper (Navbar + Footer)
    │   └── ProtectedRoute.tsx  # Auth guard for dashboard
    ├── context/                # React Context providers
    │   └── AuthContext.tsx     # Authentication state management
    ├── data/                   # Mock/static data
    │   └── courses.ts          # Course catalog data
    ├── pages/                  # Route-level page components
    │   ├── Home.tsx            # Landing page
    │   ├── Login.tsx           # Login form with validation
    │   ├── Register.tsx        # Registration form with validation
    │   ├── Dashboard.tsx       # Student dashboard
    │   └── Courses.tsx         # Course listing page
    └── types/                  # TypeScript type definitions
        └── index.ts            # Shared interfaces (User, Course, etc.)
```

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview

# Run type checking
npm run typecheck

# Run linter
npm run lint
```

## Design System

The application uses a custom Tailwind CSS design system with:

- **Color ramps**: brand (blue), accent (orange), success (green), warning (amber), error (red), ink (neutral) — each with 50–950 shades
- **Typography**: Inter for body text, Plus Jakarta Sans for headings
- **Spacing**: 8px-based spacing system
- **Shadows**: Soft, card, and glow shadow presets
- **Animations**: Fade-in-up, fade-in, scale-in, and slide-down keyframe animations
- **Components**: Pre-styled button, input, card, and label utility classes

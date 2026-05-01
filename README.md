# TaskFlow — Team Task Manager Frontend

React frontend for the TaskFlow team task management platform.

## Project Structure

```
src/
├── components/
│   ├── UI.jsx              # All reusable UI: Button, Input, Card, Modal, Badge, Avatar, etc.
│   ├── Sidebar.jsx         # App sidebar with navigation
│   ├── Topbar.jsx          # Per-page top bar with title + actions
│   ├── AppLayout.jsx       # Wraps Sidebar + main content area
│   ├── TaskCard.jsx        # Task display card (compact + full)
│   ├── TaskModal.jsx       # Create / edit task modal
│   ├── UpdateStatusModal.jsx  # Quick status update modal
│   └── ProtectedRoute.jsx  # Auth guard HOC
├── context/
│   ├── AuthContext.jsx     # login, signup, logout, user state
│   ├── ThemeContext.jsx    # dark/light theme toggle
│   └── ToastContext.jsx    # Global toast notifications
├── pages/
│   ├── HomePage.jsx        # Public marketing landing page
│   ├── LoginPage.jsx       # Login form
│   ├── RegisterPage.jsx    # Register form with role selection
│   ├── DashboardRouter.jsx # Routes admin → AdminDashboard, member → UserDashboard
│   ├── AdminDashboard.jsx  # Stats, overdue tasks, recent tasks (admin view)
│   ├── UserDashboard.jsx   # Assigned tasks, progress (member view)
│   ├── ProjectsPage.jsx    # Project grid, create project
│   ├── ProjectDetailPage.jsx  # Kanban + List view, members panel
│   ├── MyTasksPage.jsx     # Filtered task list with status groups
│   ├── TeamPage.jsx        # All members across projects (admin only)
│   └── ProfilePage.jsx     # User info, copy User ID, recent activity
└── utils/
    ├── api.js              # Axios instance with auth token interceptor
    └── helpers.js          # formatDate, isOverdue, getInitials, etc.
```

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Set your Railway API URL
cp .env.example .env
# Edit .env → set REACT_APP_API_URL=https://your-app.up.railway.app/api/v1

# 3. Start dev server
npm start

# 4. Build for production
npm run build
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Set env variable: `REACT_APP_API_URL` = your Railway backend URL
4. Deploy — `vercel.json` handles SPA routing automatically

## Themes

- **Light** — Modern Corporate: white surfaces, `#3B82F6` blue primary
- **Dark** — Dark Professional: `#0B1220` background, `#111827` surface, cyan accents

Toggle with the 🌙/☀️ button in the topbar or navbar.

## Roles

| Feature | Admin | Member |
|---------|-------|--------|
| Create projects | ✅ | ❌ |
| Create tasks | ✅ | ❌ |
| Assign tasks | ✅ | ❌ |
| Add members | ✅ | ❌ |
| Update task status | ✅ | ✅ |
| View assigned tasks | ✅ | ✅ |
| Team page | ✅ | ❌ |

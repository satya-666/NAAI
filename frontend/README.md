# Frontend - React Authentication App

A modern React application for user authentication with JWT tokens.

## Features

- 🎨 Beautiful, responsive UI with gradient backgrounds
- 🔐 User authentication (Login/Signup)
- 🛡️ Protected routes with JWT tokens
- 📱 Mobile-responsive design
- ⚡ Built with Vite for fast development
- 🎯 React Router for navigation

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with animations

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the frontend directory (optional - defaults to `http://localhost:3000/api`):

```env
VITE_API_URL=http://localhost:3000/api
```

**Note:** Make sure your backend server is running on the configured port.

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in terminal).

### 4. Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

### 5. Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # React components
│   │   ├── Home.jsx      # Landing page
│   │   ├── Login.jsx     # Login form
│   │   ├── Signup.jsx    # Signup form
│   │   ├── Dashboard.jsx # Protected dashboard
│   │   ├── Auth.css      # Auth forms styling
│   │   ├── Dashboard.css # Dashboard styling
│   │   └── Home.css      # Home page styling
│   ├── context/          # React Context
│   │   └── AuthContext.jsx # Authentication context
│   ├── services/         # API services
│   │   └── api.js        # Axios configuration and API calls
│   ├── App.jsx           # Main app component with routing
│   ├── App.css           # App-level styles
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html            # HTML template
└── package.json          # Dependencies and scripts
```

## Pages

- **/** - Home page with login/signup buttons
- **/login** - User login page
- **/signup** - User registration page
- **/dashboard** - Protected dashboard (requires authentication)

## Features Explained

### Authentication Flow

1. User signs up or logs in
2. Backend returns JWT token
3. Token is stored in localStorage
4. Token is automatically added to all API requests
5. Protected routes check for valid token
6. On token expiration, user is redirected to login

### Protected Routes

- Dashboard route requires authentication
- Unauthenticated users are redirected to `/login`
- Authenticated users visiting `/login` or `/signup` are redirected to `/dashboard`

## API Integration

The frontend communicates with the backend API endpoints:

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user info (requires token)

All API requests are configured in `src/services/api.js`.

## Styling

The app uses custom CSS with:
- Gradient backgrounds
- Smooth animations
- Responsive design
- Modern UI components
- Mobile-first approach

## Troubleshooting

### CORS Errors

Make sure your backend has CORS enabled and allows requests from the frontend origin.

### API Connection Issues

1. Verify backend is running
2. Check `VITE_API_URL` in `.env` file
3. Ensure backend and frontend are on compatible ports

### Token Issues

- Clear localStorage if authentication issues occur
- Check browser console for error messages
- Verify JWT_SECRET matches between frontend and backend

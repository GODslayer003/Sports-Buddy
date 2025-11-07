# Sports Buddy - Sports Matching Platform

A comprehensive sports matching platform that connects users based on their sports interests, skill levels, and location. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### 🎯 Core Features
- **User Authentication**: Secure signup/login with Supabase Auth
- **Profile Management**: Customize your sports preferences, skill levels, and availability
- **Event Discovery**: Browse and join sports events in your area
- **Event Creation**: Organize your own sports events
- **Partner Matching**: Find sports buddies based on preferences
- **Real-time Messaging**: Chat with other users
- **Achievements System**: Unlock badges and track your progress
- **Statistics Dashboard**: View detailed analytics about your sports activities

### 🎨 UI/UX Features
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Live connection status indicator
- **Toast Notifications**: Instant feedback for user actions
- **Search & Filters**: Advanced filtering for events and users

### 🔧 Technical Features
- **Backend Integration**: Supabase for authentication and data storage
- **Type Safety**: Full TypeScript implementation
- **Component Library**: Shadcn/ui components
- **State Management**: React Context API
- **Logging**: Comprehensive action logging for debugging

## Demo Credentials

To test the application, use these credentials:

**Regular User:**
- Email: john.doe@example.com
- Password: password123

**Admin User:**
- Email: admin@sportsbuddy.com
- Password: admin123

## Getting Started

### Prerequisites
- Node.js 16+ installed
- Supabase account (for backend features)

### Installation

1. Clone the repository
2. Install dependencies (automatically handled by Figma Make)
3. The application is pre-configured with Supabase integration

### Key Pages

- **Home/Landing**: Welcome page with app overview
- **Events**: Browse and filter sports events
- **Create Event**: Organize new sports events
- **Matching**: Find compatible sports partners
- **Messages**: Real-time chat with other users
- **Profile**: Manage your personal information
- **Settings**: Change password, security settings
- **Achievements**: Track your progress and badges
- **Statistics**: View detailed analytics
- **Admin Dashboard**: Manage sports categories, cities, and areas (admin only)

## Architecture

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS 4**: Styling
- **Shadcn/ui**: Component library
- **Lucide Icons**: Icon system

### Backend
- **Supabase**: Authentication, database, and storage
- **Deno**: Server runtime
- **Hono**: Web framework
- **KV Store**: Key-value data storage

### Theme System
The application supports light and dark modes with smooth transitions. Theme preference is stored in localStorage and respects system preferences by default.

## User Settings

When logged in, click your profile avatar → Settings to access:
- **Account Information**: View your account details
- **Change Password**: Update your password securely
- **Password Reset**: Request password reset email
- **Logout**: Securely sign out with confirmation

## Backend API

The backend provides the following endpoints:

### Authentication
- `POST /signup`: Create a new user account
- `POST /change-password`: Update user password
- `POST /reset-password`: Send password reset email

### Profile
- `GET /profile`: Get user profile
- `PUT /profile`: Update user profile

### Events
- `GET /events`: List all events
- `POST /events`: Create new event
- `PUT /events/:id`: Update event
- `DELETE /events/:id`: Delete event

### Health
- `GET /health`: Check server status

## Development Notes

### Logging
All user actions are logged to the console for debugging purposes. Check the browser console to see detailed logs of:
- Authentication events
- Profile updates
- Event interactions
- Navigation changes

### Mock Data
The application includes comprehensive mock data for:
- 12 sports categories
- Sample events
- User profiles
- Messages
- Achievements
- Statistics

## Security

- Passwords are securely hashed
- Email confirmation is auto-enabled for development
- Service role keys are kept server-side only
- Client uses public anon key for API calls
- JWT tokens for session management

## Contributing

This is a prototype application built for demonstration purposes. Feel free to extend it with additional features!

## Future Enhancements

Potential features to add:
- Weather integration for outdoor events
- Calendar sync
- Push notifications
- Social login (Google, Facebook)
- Payment integration for paid events
- Rating and review system
- Video chat for virtual events
- Advanced analytics

## License

MIT License - Feel free to use this for your own projects!

---

Built with ❤️ using Figma Make

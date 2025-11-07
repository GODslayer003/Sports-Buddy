# Data Persistence System

## Overview
The Sports Buddy application now features a comprehensive data persistence system that ensures all user-specific data is saved and restored across sessions. This works seamlessly with both Supabase backend and local storage fallback.

## What Gets Persisted

### User Profile Data
- Basic profile information (name, bio, location, etc.)
- Avatar/profile picture
- Sports preferences and skill levels
- Availability schedules
- Settings and preferences

### User Activity Data
- **Events**: Events the user has joined or created
- **Matches**: Users they have liked or passed
- **Conversations**: Message history and contacts
- **Achievements**: Unlocked achievements and progress

## How It Works

### Architecture

```
┌─────────────────┐
│   User Action   │ (Join Event, Like Match, Update Profile, etc.)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AuthContext /  │ Manages user authentication and profile
│  Component      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ userDataService │ Handles all data persistence operations
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌──────────────┐  ┌──────────────┐
│   Supabase   │  │ localStorage │
│   Backend    │  │  (Fallback)  │
└──────────────┘  └──────────────┘
```

### Data Flow

1. **On Login/Registration**:
   - User authenticates via Supabase or mock auth
   - `loadUserData()` is called to retrieve user-specific data
   - Data is cached in localStorage for quick access

2. **On Data Change** (e.g., joining an event):
   - Component calls the appropriate service function (e.g., `joinEvent()`)
   - Service attempts to sync with Supabase backend
   - If Supabase is unavailable, data is saved to localStorage
   - Component state is updated to reflect the change

3. **On Logout**:
   - User-specific data is cleared from memory
   - localStorage is cleaned up (optional: can keep for faster re-login)

## Files Structure

### Core Services
- **`/utils/userDataService.tsx`**: Main service for data persistence
  - `loadUserData()`: Load user data from backend or localStorage
  - `saveUserData()`: Save user data to backend and localStorage
  - `joinEvent()`, `leaveEvent()`: Event participation management
  - `likeMatch()`, `passMatch()`: Match interaction tracking
  - `clearUserData()`: Clean up on logout

### Hooks
- **`/hooks/useUserData.tsx`**: React hook for easy data access
  - Provides convenient methods for components
  - Automatically syncs with user authentication
  - Handles loading states

### Context
- **`/contexts/AuthContext.tsx`**: Enhanced with data loading
  - Loads user data on session restore
  - Clears data on logout
  - Updates profile data on changes

## Usage Examples

### In Components

#### Using the Service Directly
```tsx
import { joinEvent, leaveEvent, loadUserData } from '../utils/userDataService';

// Load user data
useEffect(() => {
  const loadData = async () => {
    if (user) {
      const data = await loadUserData(user.id);
      setIsJoined(data.events.includes(eventId));
    }
  };
  loadData();
}, [user]);

// Join an event
const handleJoin = async () => {
  const success = await joinEvent(user.id, eventId);
  if (success) {
    setIsJoined(true);
  }
};
```

#### Using the Hook (Recommended)
```tsx
import { useUserData } from '../hooks/useUserData';

const { userData, joinEvent, hasJoinedEvent, isLoading } = useUserData();

// Check if user has joined
const isJoined = hasJoinedEvent(eventId);

// Join an event
const handleJoin = async () => {
  const success = await joinEvent(eventId);
};
```

## Data Storage

### Supabase (Primary)
When Supabase is connected:
- Data is stored in the backend via Edge Functions
- Persistent across devices
- Real-time sync capabilities (future enhancement)
- Shared with other users (for public data)

### localStorage (Fallback)
When Supabase is unavailable:
- Data is stored locally in the browser
- Persists across page refreshes
- Device-specific (not shared)
- Automatic fallback mechanism

### Storage Keys
- `sportsbuddy_user_data_{userId}`: User-specific data
- `mockUser`: Mock authentication session

## Benefits

1. **Seamless Experience**: Users never lose their data, even when offline
2. **Graceful Degradation**: App works perfectly with or without backend
3. **User-Specific**: Each user's data is isolated and secure
4. **Performance**: localStorage caching for instant data access
5. **Flexibility**: Easy to add new data types to persist

## Components Updated

### ProfilePage
- ✅ Profile changes persist across sessions
- ✅ Avatar uploads are saved
- ✅ Sports preferences maintained
- ✅ Availability settings preserved

### EventDetailPage
- ✅ Event joins/leaves are tracked
- ✅ Status persists across page refreshes
- ✅ User's participation history maintained

### MatchingPage
- ✅ Liked matches are remembered
- ✅ Passed profiles don't reappear
- ✅ Match history preserved
- ✅ Reset option available

### MessagingPage (Ready for Integration)
- Structure in place for conversation persistence
- Ready to implement message history sync

## Future Enhancements

1. **Real-time Sync**: Use Supabase Realtime for instant updates
2. **Conflict Resolution**: Handle simultaneous edits from multiple devices
3. **Offline Queue**: Queue actions when offline, sync when back online
4. **Data Export**: Allow users to download their data
5. **Analytics**: Track user behavior patterns (privacy-compliant)

## Testing

### Manual Testing Steps

1. **Profile Persistence**:
   - Log in → Edit profile → Log out → Log back in
   - ✓ Changes should be preserved

2. **Event Participation**:
   - Join an event → Refresh page
   - ✓ Event should still show as joined

3. **Match Interactions**:
   - Like/pass matches → Close browser → Reopen
   - ✓ Same matches shouldn't reappear

4. **Cross-Session**:
   - Make changes → Log out → Log in as different user
   - ✓ Each user should have their own data

## Security & Privacy

- User data is isolated by user ID
- localStorage is domain-specific (can't be accessed by other sites)
- Supabase handles authentication and authorization
- No sensitive data (passwords, etc.) is stored in localStorage
- Data can be cleared on logout for shared devices

## Troubleshooting

### Data Not Persisting?
1. Check browser localStorage is enabled
2. Verify user is properly authenticated
3. Check console for error messages
4. Confirm Supabase connection status

### Data Sync Issues?
1. Check network connectivity
2. Verify Supabase credentials
3. Look for backend error responses
4. Check localStorage quota (shouldn't be an issue for our use case)

---

**Last Updated**: November 2025
**Version**: 1.0.0

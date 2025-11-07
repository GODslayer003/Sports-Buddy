import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Create Supabase client with service role key
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

// Middleware to verify auth token
const requireAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.replace('Bearer ', '');
  const supabase = getSupabaseClient();
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    console.error('Auth error:', error);
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('user', user);
  await next();
};

// Initialize demo accounts on startup
const initializeDemoAccounts = async () => {
  try {
    const supabase = getSupabaseClient();
    
    const demoAccounts = [
      {
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
        isAdmin: false,
      },
      {
        email: 'admin@sportsbuddy.com',
        password: 'admin123',
        name: 'Admin User',
        isAdmin: true,
      },
    ];

    for (const account of demoAccounts) {
      // Check if user already exists
      const existingUser = await kv.get(`user_email:${account.email}`);
      
      if (!existingUser) {
        try {
          const { data, error } = await supabase.auth.admin.createUser({
            email: account.email,
            password: account.password,
            user_metadata: { name: account.name },
            email_confirm: true,
          });

          if (!error && data.user) {
            const userProfile = {
              id: data.user.id,
              email: account.email,
              name: account.name,
              isAdmin: account.isAdmin,
              createdAt: new Date().toISOString(),
              profile: {
                bio: account.isAdmin ? 'System Administrator' : 'Sports enthusiast',
                location: 'New York, NY',
                preferredSports: ['Basketball', 'Soccer'],
                skillLevels: { Basketball: 'intermediate', Soccer: 'intermediate' },
                availability: ['weekday-evening', 'weekend-morning'],
              },
            };
            
            await kv.set(`user:${data.user.id}`, userProfile);
            await kv.set(`user_email:${account.email}`, data.user.id);
            console.log(`Demo account created: ${account.email}`);
          }
        } catch (err) {
          // Account might already exist, that's okay
          console.log(`Demo account ${account.email} may already exist`);
        }
      }
    }
  } catch (error) {
    console.error('Error initializing demo accounts:', error);
  }
};

// Initialize demo accounts (non-blocking)
initializeDemoAccounts();

// Health check endpoint
app.get("/make-server-716ee9da/health", (c) => {
  return c.json({ status: "ok" });
});

// User signup endpoint
app.post("/make-server-716ee9da/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    if (password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters' }, 400);
    }

    const supabase = getSupabaseClient();

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      profile: {
        bio: '',
        location: '',
        preferredSports: [],
        skillLevels: {},
        availability: [],
      },
    });

    console.log('User created successfully:', data.user.id);
    return c.json({ 
      user: { 
        id: data.user.id, 
        email: data.user.email, 
        name 
      } 
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Change password endpoint
app.post("/make-server-716ee9da/change-password", requireAuth, async (c) => {
  try {
    const { currentPassword, newPassword } = await c.req.json();
    const user = c.get('user');

    if (!currentPassword || !newPassword) {
      return c.json({ error: 'Current password and new password are required' }, 400);
    }

    if (newPassword.length < 8) {
      return c.json({ error: 'New password must be at least 8 characters' }, 400);
    }

    const supabase = getSupabaseClient();

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      console.error('Current password verification failed:', signInError);
      return c.json({ error: 'Current password is incorrect' }, 400);
    }

    // Update password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Password update error:', updateError);
      return c.json({ error: 'Failed to update password' }, 500);
    }

    console.log('Password changed successfully for user:', user.id);
    return c.json({ success: true });
  } catch (error) {
    console.error('Change password error:', error);
    return c.json({ error: 'Failed to change password' }, 500);
  }
});

// Reset password endpoint (send reset email)
app.post("/make-server-716ee9da/reset-password", async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    const supabase = getSupabaseClient();

    // In production, this would send an actual email
    // For development, we'll just log it
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.error('Password reset error:', error);
      // Don't reveal whether the email exists
      return c.json({ success: true });
    }

    console.log('Password reset email would be sent to:', email);
    return c.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return c.json({ error: 'Failed to send reset email' }, 500);
  }
});

// Get user profile
app.get("/make-server-716ee9da/profile", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const profile = await kv.get(`user:${user.id}`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({ error: 'Failed to get profile' }, 500);
  }
});

// Update user profile
app.put("/make-server-716ee9da/profile", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const updates = await c.req.json();
    
    const currentProfile = await kv.get(`user:${user.id}`);
    
    if (!currentProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const updatedProfile = {
      ...currentProfile,
      ...updates,
      id: user.id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${user.id}`, updatedProfile);

    console.log('Profile updated for user:', user.id);
    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Events endpoints
app.get("/make-server-716ee9da/events", async (c) => {
  try {
    const events = await kv.getByPrefix('event:');
    return c.json({ events: events || [] });
  } catch (error) {
    console.error('Get events error:', error);
    return c.json({ error: 'Failed to get events' }, 500);
  }
});

app.post("/make-server-716ee9da/events", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const eventData = await c.req.json();
    
    const eventId = `event:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const event = {
      ...eventData,
      id: eventId,
      organizerId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(eventId, event);

    console.log('Event created:', eventId);
    return c.json({ event });
  } catch (error) {
    console.error('Create event error:', error);
    return c.json({ error: 'Failed to create event' }, 500);
  }
});

app.put("/make-server-716ee9da/events/:id", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const eventId = c.req.param('id');
    const updates = await c.req.json();
    
    const event = await kv.get(`event:${eventId}`);
    
    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }

    if (event.organizerId !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    const updatedEvent = {
      ...event,
      ...updates,
      id: eventId,
      organizerId: event.organizerId,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`event:${eventId}`, updatedEvent);

    console.log('Event updated:', eventId);
    return c.json({ event: updatedEvent });
  } catch (error) {
    console.error('Update event error:', error);
    return c.json({ error: 'Failed to update event' }, 500);
  }
});

app.delete("/make-server-716ee9da/events/:id", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const eventId = c.req.param('id');
    
    const event = await kv.get(`event:${eventId}`);
    
    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }

    if (event.organizerId !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    await kv.del(`event:${eventId}`);

    console.log('Event deleted:', eventId);
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete event error:', error);
    return c.json({ error: 'Failed to delete event' }, 500);
  }
});

Deno.serve(app.fetch);
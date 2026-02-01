# Quick Integration Guide (AI-Optimized)

This guide is optimized for AI assistants to quickly integrate Live Avatar into any project.

## Prerequisites Check

Before starting, verify:

- [ ] Node.js 18+ installed
- [ ] React project exists
- [ ] Express server exists or can be created
- [ ] User has HeyGen account with API access
- [ ] User has: API key, Avatar ID, Voice ID, Context ID

## Integration Checklist

### 1. Copy Files

```bash
# Copy component
cp components/LiveAvatarChat.tsx {PROJECT_ROOT}/src/components/

# Copy server routes
cp server/liveavatar-routes.ts {PROJECT_ROOT}/server/
```

### 2. Install Dependencies

```bash
npm install livekit-client framer-motion lucide-react express
# or
pnpm add livekit-client framer-motion lucide-react express
```

### 3. Setup Environment Variables

Create `.env` in project root:

```env
LIVEAVATAR_API_KEY="<ASK_USER_FOR_THIS>"
LIVEAVATAR_AVATAR_ID="<ASK_USER_FOR_THIS>"
LIVEAVATAR_VOICE_ID="<ASK_USER_FOR_THIS>"
LIVEAVATAR_CONTEXT_ID="<ASK_USER_FOR_THIS>"
```

**Important:** Ask user for these values. Do NOT make them up.

### 4. Register Server Routes

Find or create main server file (usually `server.ts`, `index.ts`, or `app.ts`).

Add these lines:

```typescript
import express from 'express';
import { registerLiveAvatarRoutes } from './server/liveavatar-routes';

const app = express();

// IMPORTANT: Must have JSON middleware
app.use(express.json());

// Register Live Avatar routes
registerLiveAvatarRoutes(app);

// ... rest of server code
```

**Critical:** `express.json()` middleware must be added BEFORE `registerLiveAvatarRoutes()`.

### 5. Integrate Component

In the React component where user wants the avatar:

```tsx
import { useState } from 'react';
import { LiveAvatarChat } from './components/LiveAvatarChat';

function YourComponent() {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  return (
    <div>
      {/* Trigger button */}
      <button onClick={() => setIsAvatarOpen(true)}>
        Call AI Assistant
      </button>

      {/* Avatar component */}
      <LiveAvatarChat
        isOpen={isAvatarOpen}
        onClose={() => setIsAvatarOpen(false)}
        language="en"
      />
    </div>
  );
}
```

### 6. Test

1. Start server: `npm run dev` or `pnpm dev`
2. Open browser
3. Click trigger button
4. Verify:
   - Avatar video appears
   - Audio works (may need to click "Enable Sound")
   - Microphone works (browser asks for permission)
   - Can have conversation with avatar

## Common Modifications

### Change Language to Russian

```tsx
<LiveAvatarChat
  language="ru"
  // ... other props
/>
```

### Customize Appearance

```tsx
<LiveAvatarChat
  config={{
    avatarName: "Sofia",
    avatarInitials: "S",
    avatarGradient: "from-purple-500 to-pink-500",
    startButtonText: "Start Call",
  }}
  // ... other props
/>
```

### Add Analytics

```tsx
<LiveAvatarChat
  config={{
    onSessionEnd: (sessionId, duration) => {
      console.log('Session ended:', { sessionId, duration });
      // Send to analytics
      fetch('/api/analytics', {
        method: 'POST',
        body: JSON.stringify({ sessionId, duration }),
      });
    },
  }}
  // ... other props
/>
```

### Multiple Contexts

If user needs different avatar behaviors (sales, support, etc.):

1. Add environment variables:
```env
LIVEAVATAR_CONTEXT_ID_SALES="context_id_1"
LIVEAVATAR_CONTEXT_ID_SUPPORT="context_id_2"
```

2. Update `server/liveavatar-routes.ts`:
```typescript
const CONTEXT_IDS = {
  default: process.env.LIVEAVATAR_CONTEXT_ID || '',
  sales: process.env.LIVEAVATAR_CONTEXT_ID_SALES || '',
  support: process.env.LIVEAVATAR_CONTEXT_ID_SUPPORT || '',
};
```

3. Pass context from component:
```tsx
<LiveAvatarChat context="sales" ... />
```

## Troubleshooting Decision Tree

```
Problem: Avatar doesn't connect
├─ Check: Are environment variables set?
│  ├─ No → Ask user for values
│  └─ Yes → Continue
├─ Check: Is server running?
│  ├─ No → Start server
│  └─ Yes → Continue
├─ Check: Does /api/liveavatar/token return 200?
│  ├─ No → Check server logs for errors
│  └─ Yes → Check browser console for errors

Problem: Microphone doesn't work
├─ Check: Did browser ask for permission?
│  ├─ No → User may have blocked it in browser settings
│  └─ Yes → Continue
├─ Check: Is handleActiveSpeakersChanged in component?
│  ├─ No → Component file is corrupted, re-copy from template
│  └─ Yes → Check for JavaScript errors in console

Problem: No audio from avatar
├─ Check: Is "Enable Sound" button visible?
│  ├─ Yes → User must click it (browser autoplay policy)
│  └─ No → Continue
├─ Check: System volume and browser audio settings
└─ Check: Browser console for audio errors
```

## File Locations Reference

```
{PROJECT_ROOT}/
├── src/
│   └── components/
│       └── LiveAvatarChat.tsx          ← Copy here
├── server/
│   └── liveavatar-routes.ts            ← Copy here
├── .env                                 ← Create with user's keys
└── package.json                         ← Add dependencies here
```

## Validation Steps

After integration, verify:

1. ✅ Files copied to correct locations
2. ✅ Dependencies installed
3. ✅ Environment variables set
4. ✅ Server routes registered
5. ✅ Component imported and used
6. ✅ Server starts without errors
7. ✅ Component renders when isOpen=true
8. ✅ Can connect to avatar
9. ✅ Audio and microphone work
10. ✅ Can have full conversation

## Next Steps

After basic integration works, suggest:

1. **Customize appearance** to match project branding
2. **Add analytics** to track usage
3. **Implement multiple contexts** if needed
4. **Add error boundaries** for production
5. **Setup monitoring** for avatar availability

## Important Reminders

- ⚠️ Never remove `handleActiveSpeakersChanged` - it prevents microphone freeze
- ⚠️ Always use `express.json()` middleware
- ⚠️ Never commit `.env` to Git
- ⚠️ On Replit, use Secrets instead of `.env`
- ⚠️ HTTPS required in production for microphone access

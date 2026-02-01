# HeyGen Live Avatar Integration Template (AI-Optimized)

This template is specifically designed for **AI assistants** (Replit Agent, Cursor, Claude, etc.) to quickly and correctly integrate HeyGen Live Avatar into any web project.

## 🤖 For AI Assistants: Start Here

**Before doing anything else, read these files in order:**

1. **`.ai/SYSTEM_PROMPT.md`** - Core knowledge about this template
2. **`.ai/QUICK_INTEGRATION.md`** - Fast integration guide
3. **`.ai/STEP_BY_STEP.md`** - Detailed step-by-step instructions
4. **`.ai/ARCHITECTURE.md`** - Deep technical understanding

## 📁 Template Structure

```
live-avatar-ai-template/
├── .ai/                              # AI-specific documentation
│   ├── SYSTEM_PROMPT.md              # Core knowledge for AI
│   ├── QUICK_INTEGRATION.md          # Quick integration guide
│   ├── STEP_BY_STEP.md               # Detailed step-by-step
│   └── ARCHITECTURE.md               # Technical deep dive
├── components/
│   └── LiveAvatarChat.tsx            # Main React component
├── server/
│   └── liveavatar-routes.ts          # Express server routes
├── examples/
│   └── App.tsx                       # Integration examples
└── README.md                         # This file
```

## 🎯 What This Template Solves

### The Problem

Naive Live Avatar implementations suffer from **microphone freeze** after 1-2 questions. This happens because events from HeyGen API can be lost or delayed.

### The Solution

This template uses a **dual-mechanism approach**:

1. **Primary:** Listen to HeyGen API events (`avatar_start_talking`, `avatar_stop_talking`)
2. **Backup:** Monitor LiveKit's `ActiveSpeakersChanged` event

If primary fails, backup takes over automatically. This ensures reliable microphone control.

## 🚀 Quick Integration (AI Summary)

### 1. Copy Files

```bash
cp components/LiveAvatarChat.tsx {PROJECT}/src/components/
cp server/liveavatar-routes.ts {PROJECT}/server/
```

### 2. Install Dependencies

```bash
npm install livekit-client framer-motion lucide-react express
```

### 3. Setup Environment

Create `.env`:
```env
LIVEAVATAR_API_KEY="<from user>"
LIVEAVATAR_AVATAR_ID="<from user>"
LIVEAVATAR_VOICE_ID="<from user>"
LIVEAVATAR_CONTEXT_ID="<from user>"
```

### 4. Register Server Routes

In main server file:
```typescript
import { registerLiveAvatarRoutes } from './server/liveavatar-routes';

const app = express();
app.use(express.json()); // Required
registerLiveAvatarRoutes(app);
```

### 5. Use Component

In React component:
```tsx
import { LiveAvatarChat } from './components/LiveAvatarChat';
import { useState } from 'react';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Call AI</button>
      <LiveAvatarChat
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        language="en"
      />
    </>
  );
}
```

## ⚠️ Critical Reminders for AI

1. **Never remove `handleActiveSpeakersChanged`** - It's the backup mechanism
2. **Always use `express.json()` middleware** before registering routes
3. **Always ask user for HeyGen credentials** - Never make them up
4. **Check file paths carefully** - Adjust imports based on project structure
5. **Test microphone after integration** - Verify it works for 3+ exchanges

## 📚 Documentation Index

### For Quick Integration
- Start with `.ai/QUICK_INTEGRATION.md`
- Use `.ai/STEP_BY_STEP.md` if issues arise

### For Deep Understanding
- Read `.ai/ARCHITECTURE.md` for technical details
- Check `examples/App.tsx` for usage patterns

### For Troubleshooting
- Refer to troubleshooting sections in `.ai/QUICK_INTEGRATION.md`
- Check error handling in `.ai/STEP_BY_STEP.md`

## 🔧 Component API

### Required Props

```typescript
<LiveAvatarChat
  isOpen={boolean}              // Control visibility
  onClose={() => void}          // Close callback
/>
```

### Optional Props

```typescript
<LiveAvatarChat
  language="en" | "ru"          // UI language (default: "en")
  context="string"              // Context key for server (default: "default")
  config={{                     // Customization options
    avatarName?: string,
    avatarInitials?: string,
    avatarGradient?: string,
    startButtonText?: string,
    onSessionEnd?: (sessionId, duration) => void,
    // ... see ARCHITECTURE.md for full list
  }}
/>
```

## 🧪 Testing Checklist

After integration, verify:

- [ ] Server starts without errors
- [ ] Avatar connects when button clicked
- [ ] Video appears
- [ ] Audio works (may need "Enable Sound" click)
- [ ] Microphone gets permission
- [ ] Microphone mutes when avatar speaks
- [ ] Microphone unmutes when avatar stops
- [ ] Can have 3+ back-and-forth exchanges
- [ ] Can close and reopen successfully

## 🌐 Deployment Notes

### Replit
- Use **Secrets** instead of `.env` file
- Add all `LIVEAVATAR_*` variables to Secrets
- Ensure `.replit` run command is correct

### Other Platforms
- Ensure HTTPS (required for microphone)
- Set environment variables in platform settings
- Check CORS if frontend and backend are separate domains

## 📖 Version History

- **v1.0.0** (2026-01-27) - Initial AI-optimized template based on goodwinteam architecture

## 🆘 Support

If integration fails:

1. Check `.ai/STEP_BY_STEP.md` error handling section
2. Verify all files were copied correctly
3. Confirm all dependencies are installed
4. Check browser console for errors
5. Check server logs for errors

## 📄 License

This template is provided as-is for integration purposes.

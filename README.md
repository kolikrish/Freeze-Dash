# 🧊 Freeze Dash (Red Light, Green Light Web Edition)

An interactive, real-time web application inspired by the iconic **Red Light, Green Light** game (Squid Game edition). Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Firebase Firestore**, supporting both **Single Player** and **Real-Time Multiplayer** rooms with live leaderboards.

---

## 🌟 Key Features

- **🎮 Single Player Mode**: Practice your reflexes in **Freeze Dash** against the automated light cycle.
- **🌐 Real-Time Multiplayer Rooms**: Create custom game rooms or join existing sessions using a unique Room Code.
- **🔊 Audio & SFX Integration**: Immersive audio cues (`play.mp3` for Green Light, `stop.mp3` for Red Light).
- **⏱️ Dynamic Precision Timing & Progress Tracking**: Millisecond-accurate timer tracking and smooth progress movement.
- **🏆 Live Room Leaderboard**: Automatic ranking algorithm based on score, completion status, completion time, and tiebreakers.
- **📊 Real-Time Stats Dashboard**: Instant overview of active room players, record completion time, and top score.
- **📱 Responsive UI**: High-contrast, dark-themed glassmorphism interface powered by Tailwind CSS.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/)
- **Database & Backend**: [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) & [Firestore Database](https://firebase.google.com/docs/firestore)
- **Authentication / Tokens**: JSON Web Tokens (`jsonwebtoken`)

---

## 📂 Project Structure

```
freeze-dash/
├── public/
│   └── sound/            # Game audio files (play.mp3, stop.mp3)
├── src/
│   ├── app/
│   │   ├── api/game/     # Serverless API routes
│   │   │   ├── create/      # Create new multiplayer session room
│   │   │   ├── join/        # Join an existing multiplayer session room
│   │   │   ├── leaderboard/ # Real-time ranking algorithm & status
│   │   │   ├── stats/       # Session performance statistics
│   │   │   ├── totalplayer/ # Connected player counts
│   │   │   └── update/      # Player state/progress update endpoint
│   │   ├── multiplayer/  # Multiplayer lobby & session pages ([session])
│   │   ├── play/         # Single-player game route
│   │   ├── globals.css   # Global Tailwind styles
│   │   ├── layout.tsx    # Root layout template (Metadata & Layout)
│   │   └── page.tsx      # Main landing / Freeze Dash home screen
│   ├── components/
│   │   ├── game/         # Game engine UI (GameArea, Navbar, Win/GameOver Modals)
│   │   │   └── hooks/    # Custom game hooks (useLight, useProgress, useTimer, useDebounce)
│   │   ├── LeaderboardList.tsx # Real-time leaderboard component
│   │   └── Stats.tsx          # Real-time statistics bar component
│   └── utils/
│       ├── Db.ts         # Firebase Admin SDK initialization & Firestore instance
│       ├── jwt.ts        # Token generator and verifier helpers
│       └── types/        # TypeScript interfaces & game state enums
├── .env.local            # Firebase service account credentials (git-ignored)
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies & scripts ("freeze-dash")
└── tsconfig.json         # TypeScript configuration
```

---

## 🎮 How to Play Freeze Dash

1. **Green Light**: Tap & **hold** the action button (or spacebar/touch target) to dash forward towards the finish line.
2. **Red Light**: **Freeze immediately!** Release the button when the light turns Red. Moving during Red Light causes instant elimination.
3. **Finish Line**: Reach **100% progress** before the timer runs out to win!

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js 18+** and **npm** installed on your system.

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/freeze-dash.git
cd freeze-dash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root with your Firebase Service Account credentials:

```env
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start playing **Freeze Dash**!

---

## 🛰️ API Endpoints Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/game/create` | `POST` | Generates a new multiplayer game session ID with a 5-minute TTL. |
| `/api/game/join` | `POST` | Registers a player into a game session with player name. |
| `/api/game/update` | `POST` | Recieves player progress, state (`playing`, `won`, `lost`), and elapsed time. |
| `/api/game/leaderboard` | `GET` | Returns sorted room standings, requesting player's rank, and best times. |
| `/api/game/stats` | `GET` | Returns aggregated session metrics (best score, best completion time). |
| `/api/game/totalplayer` | `GET` | Retrieves active player count for a given game session. |

---

## 📜 Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Compiles the application for production deployment.
- `npm run start`: Runs the built production server.
- `npm run lint`: Runs ESLint check across codebase.

---

## 🛡️ License

This project is created for educational and entertainment purposes. Inspired by the classic *Red Light, Green Light* game.

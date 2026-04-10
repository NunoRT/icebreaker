# Ice Breaker App

A fun interactive app for new development teams to get to know each other! Features an animated ice-breaking intro, spinning roulette wheels for topic and person selection, and a management panel.

## Features

- **Ice Breaking Animation** - Animated ice block that cracks and shatters with "Let's Break the Ice"
- **Topic Roulette** - Spin the wheel to randomly select a conversation topic
- **Person Roulette** - Spin again to select who starts answering
- **Manage Panel** - Add/remove topics and team members
- **Firebase Firestore** - Cloud database for topics and people

## Setup

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Enable **Firestore Database** (start in test mode for development)
4. Go to Project Settings > Service Accounts > Generate new private key
5. Save the downloaded JSON file as `backend/serviceAccountKey.json`

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env if needed (default path to serviceAccountKey.json should work)
npm install
npm run seed   # Populate database with sample topics and people
npm run dev    # Start the development server on port 3001
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev    # Start Vite dev server on port 5173
```

### 4. Open the app

Navigate to `http://localhost:5173`

## Tech Stack

- **Backend**: Node.js, Express, Firebase Admin SDK
- **Frontend**: React 18, Vite, CSS3 Animations
- **Database**: Firebase Firestore

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/topics` | Get all topics |
| POST | `/api/topics` | Add a new topic |
| DELETE | `/api/topics/:id` | Delete a topic |
| GET | `/api/people` | Get all people |
| POST | `/api/people` | Add a new person |
| DELETE | `/api/people/:id` | Delete a person |
| GET | `/api/health` | Health check |

<p align="center">
  <img src="public/wordmark.svg" alt="Poetry Cam Wordmark" width="400">
</p>

## Overview
**Poetry Cam** is a visual-to-text translator device. This frontend application is the companion web gallery where users can view, manage, and share the AI-generated poems captured by their Poetry Cam hardware.

## Key Features
- **User Authentication**: Secure login via Google or Email/Password (Firebase Auth).
- **Poem Gallery**: Browse through your collection of captured poems with an elegant, responsive interface.
- **Real-time Updates**: Automatically detects new poems arriving from the device using Firebase Firestore snapshots.
- **Visual Palette**: Each poem includes a color palette extracted from the original scene.
- **Export to Image**: Download poems as high-quality PNGs formatted for social media (Instagram style).
- **Poem Management**: Delete unwanted captures directly from the interface.

## Tech Stack
- **Framework**: [Vite](https://vitejs.dev/) + [React](https://reactjs.org/)
- **Styling**: [Styled Components](https://styled-components.com/)
- **Backend/Auth**: [Firebase](https://firebase.google.com/) (Auth & Firestore)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Image Export**: [html-to-image](https://www.npmjs.com/package/html-to-image)

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A Firebase project

### 2. Environment Setup
Create a `.env` file in the root directory and add your credentials (see `.env.example` for the required keys):
```env
VITE_BACKEND_URL=your_backend_api_url
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Installation
```bash
npm install
```

### 4. Development
```bash
npm run dev
```

### 5. Build
```bash
npm run build
```

## Hardware Compatibility
This frontend is designed to work with the [Machine Vision Peeper](https://github.com/dzaharia1/Machine-Vision-Peeper) firmware. When the device captures an image, it is processed by the backend and stored in Firestore. This application listens for those changes to provide a seamless, real-time viewing experience.

---
Created by [dan](https://danmade.app)

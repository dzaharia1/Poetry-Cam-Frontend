# CLAUDE.md — Poetry Cam Frontend

This file provides context for AI assistants working in this repository. It covers project structure, development conventions, and key workflows.

---

## Project Overview

Poetry Cam is a React web application that allows authenticated users to upload photos and receive AI-generated poems based on the images. Users can view, favorite, and export their poem collection. The app also supports public poem sharing via unique URLs.

**Tech Stack:**
- **Framework:** React 18 with Vite 5
- **Routing:** React Router DOM 7
- **Styling:** Styled Components 6 (CSS-in-JS) + custom theme system
- **Backend:** REST API (URL from `VITE_BACKEND_URL` env var)
- **Authentication & Database:** Firebase (Auth + Firestore)
- **Testing:** Vitest 2 + React Testing Library
- **Icons:** Lucide React
- **Image Export:** html-to-image

---

## Repository Structure

```
Poetry-Cam-Frontend/
├── src/
│   ├── components/
│   │   ├── basecomponents/     # Reusable UI primitives
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Dropdown.jsx
│   │   │   ├── IconButton.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Tabs.jsx
│   │   │   └── TextInput.jsx
│   │   ├── navigation/         # Sidebar navigation
│   │   │   ├── MenuButton.jsx
│   │   │   ├── NavBar.jsx
│   │   │   └── NavItem.jsx
│   │   ├── poem/               # Poem display and export
│   │   │   ├── ColorCollection.jsx
│   │   │   ├── Poem.jsx
│   │   │   ├── PoemExport.jsx
│   │   │   └── PoemSkeleton.jsx
│   │   ├── Admin.jsx           # Admin user management
│   │   ├── Auth.jsx            # Login / registration
│   │   ├── CameraButton.jsx    # File input for image capture
│   │   ├── Home.jsx            # Main authenticated gallery page
│   │   ├── PageNavigation.jsx  # Prev/next poem controls
│   │   ├── Settings.jsx        # Settings modal
│   │   ├── SplashScreen.jsx    # Loading screen
│   │   ├── TopBar.jsx          # Top navigation bar
│   │   └── WebDisplay.jsx      # Public poem sharing page
│   ├── contexts/
│   │   └── ThemeContext.jsx    # Light/dark/auto theme management
│   ├── utils/
│   │   ├── api.js              # Backend URL construction helper
│   │   ├── fetchWithAuth.js    # Authenticated fetch with token refresh
│   │   └── firebaseErrorHandling.js  # Firebase error → user-friendly messages
│   ├── firebase.js             # Firebase app, auth, and Firestore initialization
│   ├── theme.js                # Light and dark theme definitions
│   ├── index.css               # Global styles and font imports
│   ├── main.jsx                # React DOM entry point
│   ├── setupTests.js           # Vitest global mocks (Firebase, matchMedia, etc.)
│   └── test-utils.jsx          # Custom render() with ThemeProvider wrapper
├── public/                     # Static assets
├── dist/                       # Build output (git-ignored)
├── index.html                  # HTML entry point with CSP meta tag
├── vite.config.js              # Vite and Vitest configuration
├── package.json
├── .eslintrc.cjs
├── .prettierrc
├── .env.example                # Template for required environment variables
├── README.md
└── TESTING.md
```

---

## Routes

| Path | Component | Auth Required |
|------|-----------|--------------|
| `/` | `Home.jsx` | Yes |
| `/web-display/:userId` | `WebDisplay.jsx` | No |
| `/admin` | `Admin.jsx` | Yes (admin only) |

Unauthenticated users on protected routes are redirected to the `Auth.jsx` login page.

---

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Copy and fill in required environment variables
cp .env.example .env
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint with zero-warnings policy |
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Vitest UI dashboard |
| `npm run test:coverage` | Generate coverage report |

### Environment Variables

All variables use the `VITE_` prefix (required by Vite to expose to the browser).

```env
VITE_BACKEND_URL=http://localhost:3109

# Firebase project credentials
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Access them in code via `import.meta.env.VITE_*`.

---

## API Reference

All authenticated endpoints pass the Firebase ID token as `Authorization: Bearer <token>`. Use the `fetchWithAuth()` utility from `src/utils/fetchWithAuth.js`; it handles automatic token refresh on 401 responses.

The backend base URL is constructed by `src/utils/api.js` using `VITE_BACKEND_URL`.

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/poemList` | GET | ✓ | Fetch paginated poem list |
| `/getPoem` | GET | ✓ | Get a single poem by index |
| `/generate-poem` | POST | ✓ | Upload image and generate poem |
| `/generate-sketch` | POST | ✓ | Generate sketch for a poem |
| `/deletePoem` | DELETE | ✓ | Delete poem by ID |
| `/toggleFavorite` | POST | ✓ | Toggle favorite status |
| `/get-settings` | GET | ✓ | Fetch user settings |
| `/update-settings` | POST | ✓ | Save user settings |
| `/public/getPoem` | GET | ✗ | Public poem for sharing |
| `/admin/users` | GET | ✓ | List all users (admin) |
| `/admin/add-user` | POST | ✓ | Add user to whitelist (admin) |

---

## Key Conventions

### Styling

- All component styles use **Styled Components**. Do not introduce plain CSS modules or inline styles.
- Import the current theme via `useContext(ThemeContext)` and pass as a prop to styled components or reference it directly in template literals.
- Theme definitions live in `src/theme.js`. Light and dark themes share a common structure with `colors`, `typography`, `spacing`, and `breakpoints`.
- **Breakpoints:** mobile ≤ 800px, tablet ≤ 1120px.
- **Spacing scale:** `0, 4px, 8px, 16px, 24px, 44px` (indices 0–5 in `theme.spacing`).
- **Typography:** "Young Serif" for headings, "Habibi" for body text.

### Components

- Prefer the base components in `src/components/basecomponents/` for buttons, inputs, modals, cards, etc. before creating new primitives.
- Page-level components (e.g., `Home.jsx`) manage their own state and orchestrate child components.
- Context state (theme) is the only global state mechanism. There is no Redux or Zustand.

### Imports & Formatting

Prettier config (`.prettierrc`):
```json
{
  "bracketSameLine": true,
  "trailingComma": "all",
  "singleQuote": true
}
```

ESLint extends `eslint:recommended`, `react/recommended`, and `react/jsx-runtime`. The following rules are intentionally disabled:
- `react/prop-types` — prop-types are not used in this project.
- `react-hooks/exhaustive-deps` — suppressed; be careful with hook dependencies.
- `no-unused-vars` — suppressed; clean up unused variables manually.

### Firebase

- Firebase is initialized once in `src/firebase.js`. Import `auth` and `db` from there.
- Firestore real-time listeners use `onSnapshot()` on the `poems` collection filtered by `userId`, ordered by `timestamp` descending.
- Never commit Firebase credentials. All Firebase config is loaded from environment variables.

### Token Refresh

`fetchWithAuth(url, options)` in `src/utils/fetchWithAuth.js`:
- Attaches `Authorization: Bearer <token>` to every request.
- On 401, fetches a fresh ID token and retries the request once.
- Use this for all authenticated API calls.

### Theme Persistence

- Theme mode (`light`/`dark`/`auto`) is stored in `localStorage` under the key `themeMode`.
- Sort mode (`date`/`fave`) is stored under `poemSortMode`.
- `auto` mode follows the system preference via `window.matchMedia('(prefers-color-scheme: dark)')`.

---

## Testing

### Running Tests

```bash
npm test              # single run
npm run test:watch    # watch mode
npm run test:coverage # coverage report
```

### Test File Locations

Test files sit next to the source files they test, using the `.test.jsx` / `.test.js` suffix:

```
src/contexts/ThemeContext.test.jsx
src/components/basecomponents/Button.test.jsx
src/components/basecomponents/TextInput.test.jsx
src/components/TopBar.test.jsx
src/components/PageNavigation.test.jsx
src/components/navigation/NavBar.test.jsx
src/components/poem/Poem.test.jsx
src/utils/api.test.js
src/utils/fetchWithAuth.test.js
src/utils/firebaseErrorHandling.test.js
```

### Writing Tests

- Use the custom `render()` from `src/test-utils.jsx` instead of RTL's `render` directly. It wraps the component in `ThemeContextProvider`.
- Firebase modules are globally mocked in `setupTests.js`; do not import real Firebase in tests.
- Use `describe` / `it` / `expect` (Vitest globals are enabled in `vite.config.js`).

```jsx
import { render, screen } from '../test-utils';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Mocked Globals (`setupTests.js`)

- `firebase/app`, `firebase/auth`, `firebase/firestore` — fully mocked
- `window.matchMedia` — mocked for theme detection
- `localStorage` — mock implementation
- `IntersectionObserver` — mocked globally

---

## State Management Patterns

### Home Component (Primary State)

`Home.jsx` is the main orchestrator and holds the bulk of the app state:

| State | Purpose |
|-------|---------|
| `user` | Current Firebase authenticated user |
| `poems` | Full ordered list of user poems |
| `currentIndex` | Index of the currently displayed poem |
| `currentPoem` | Poem text content |
| `isGenerating` | True while a poem is being generated |
| `sketchUrl` | URL of the AI-generated sketch image |
| `sortMode` | `'date'` or `'fave'` (persisted to localStorage) |
| `isFavorite`, `colors`, `title`, `date` | Metadata for the current poem |

### ThemeContext

Manages light/dark/auto theme globally. Access it with:

```jsx
import { ThemeContext } from '../contexts/ThemeContext';
const { theme, themeMode, setThemeMode } = useContext(ThemeContext);
```

### Firestore Real-time Sync

`Home.jsx` attaches an `onSnapshot` listener to detect newly generated poems:
- Watches the `poems` collection filtered by `userId`
- Triggers a poem list refresh when the most recent poem changes
- Detects `sketchUrl` updates to show sketches as they become available

---

## Image Export

`PoemExport.jsx` renders an offscreen 1080×1080px element styled for Instagram. `html-to-image` converts it to a PNG blob that is downloaded when the user clicks Export.

---

## Content Security Policy

`index.html` defines a CSP `<meta>` tag that:
- Restricts scripts to self, Google APIs, and Firebase
- Restricts images to self, `data:`, and Firebase Storage
- Allows connections to Google APIs and Firebase services
- Does not allow service workers

When adding new third-party resources, update the CSP in `index.html`.

---

## Common Pitfalls

1. **Missing `.env` values** — The app will silently fail to connect to Firebase or the backend if env vars are unset. Check `.env.example` for required keys.
2. **Authenticated routes** — All backend calls must use `fetchWithAuth` rather than `fetch` directly to avoid token expiry issues.
3. **Theme context in tests** — Always use `test-utils.jsx`'s `render` to avoid "ThemeContext value is undefined" errors.
4. **Firestore mock** — Tests that trigger Firestore calls must mock the relevant functions from `firebase/firestore` before rendering.
5. **ESLint zero-warnings** — `npm run lint` fails on any warning. Fix warnings before committing.
6. **Styled Components + theme** — Passing the `theme` object into styled components must be done explicitly via props; there is no `ThemeProvider` wrapping styled-components (the project uses a custom context instead).

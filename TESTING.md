# Testing Guide

This project uses [Vitest](https://vitest.dev/) for unit and integration testing, and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for component testing.

## Running Tests

*   **Run all tests**: `npm test`
*   **Run tests and watch for changes**: `npm run test:watch`
*   **Run tests with UI**: `npm run test:ui`
*   **Run specific test file**: `npm test src/path/to/test.file`
*   **Generate coverage report**: `npm run test:coverage`

## Writing Tests

### File Structure
Tests should be placed next to the file being tested, with the `.test.jsx` or `.test.js` extension.

### Component Tests
Use `render` from `src/test-utils.jsx` instead of `@testing-library/react`. This wraps the component in the necessary providers (e.g., `ThemeProvider`).

```javascript
import { render, screen } from '../../test-utils';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Unit Tests
For utility functions, you can import them directly and assert their behavior.

```javascript
import { describe, it, expect } from 'vitest';
import { myUtility } from './myUtility';

describe('myUtility', () => {
  it('does something', () => {
    expect(myUtility()).toBe(true);
  });
});
```

### Mocks
*   **Firebase**: Firebase services (`auth`, `firestore`, `app`) are mocked globally in `src/setupTests.js`. You can verify calls to these mocks in your tests.
*   **Window**: `window.matchMedia` and `IntersectionObserver` are mocked globally.
*   **Environment Variables**: `VITE_BACKEND_URL` is set in `.env.test`.

## Configuration

*   `vite.config.js`: Contains Vitest configuration (merged with Vite config).
*   `src/setupTests.js`: Global test setup file. It imports `@testing-library/jest-dom` and sets up global mocks.
*   `src/test-utils.jsx`: Custom render function and re-exports from testing-library.

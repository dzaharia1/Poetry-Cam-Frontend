/**
 * Maps Firebase Auth error codes to user-friendly error messages.
 * Logs the raw error to the console for debugging.
 *
 * @param {Error} error - The error object from Firebase Auth.
 * @returns {string} - A user-friendly error message.
 */
export const mapAuthError = (error) => {
  // Log the raw error for debugging purposes
  console.error('Auth Error:', error);

  if (!error || !error.code) {
    return 'An unexpected error occurred. Please try again.';
  }

  switch (error.code) {
    case 'auth/invalid-email':
      return 'Invalid email format.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      // Generic message to prevent user enumeration
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Maps Firebase error codes to user-friendly messages.
 * @param {Object} error - The Firebase error object.
 * @returns {string} - A user-friendly error message.
 */
export const getFriendlyErrorMessage = (error) => {
  // Log the raw error for debugging purposes
  console.error('Firebase Error:', error);

  // If error is not an object or doesn't have a code, return a generic message
  if (!error || !error.code) {
    return 'An unexpected error occurred. Please try again.';
  }

  switch (error.code) {
    case 'auth/invalid-email':
      return 'The email address is invalid.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'The email address is already in use by another account.';
    case 'auth/weak-password':
      return 'The password is too weak.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completing.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled.';
    case 'auth/too-many-requests':
      return 'Too many requests. Please try again later.';
    case 'auth/credential-already-in-use':
      return 'This credential is already associated with a different user account.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      // Fallback for unhandled errors
      return 'An error occurred. Please try again.';
  }
};

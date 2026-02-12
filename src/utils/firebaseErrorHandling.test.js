import { describe, it, expect, vi } from 'vitest';
import { getFriendlyErrorMessage } from './firebaseErrorHandling';

describe('getFriendlyErrorMessage', () => {
  it('returns generic error if no error object', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(getFriendlyErrorMessage(null)).toBe('An unexpected error occurred. Please try again.');
    consoleSpy.mockRestore();
  });

  it('returns mapped error message for known codes', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(getFriendlyErrorMessage({ code: 'auth/user-not-found' })).toBe('No account found with this email.');
    expect(getFriendlyErrorMessage({ code: 'auth/wrong-password' })).toBe('Incorrect password. Please try again.');
    consoleSpy.mockRestore();
  });

  it('returns generic error for unknown codes', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(getFriendlyErrorMessage({ code: 'unknown/error' })).toBe('An error occurred. Please try again.');
    consoleSpy.mockRestore();
  });
});

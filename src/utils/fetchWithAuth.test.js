import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchWithAuth } from './fetchWithAuth';
import { auth } from '../firebase';

describe('fetchWithAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws error if user not authenticated', async () => {
    auth.currentUser = null;
    await expect(fetchWithAuth('/test')).rejects.toThrow('No authenticated user');
  });

  it('adds Authorization header with ID token', async () => {
    auth.currentUser = {
      getIdToken: vi.fn().mockResolvedValue('fake-token'),
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
      status: 200,
    });

    await fetchWithAuth('/test', { method: 'POST', body: 'data' });

    expect(auth.currentUser.getIdToken).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith('/test', {
      method: 'POST',
      body: 'data',
      headers: {
        Authorization: 'Bearer fake-token',
      },
    });
  });

  it('refreshes token on 401 TOKEN_EXPIRED', async () => {
    auth.currentUser = {
      getIdToken: vi.fn()
        .mockResolvedValueOnce('expired-token')
        .mockResolvedValueOnce('new-token'),
    };

    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValue({ code: 'TOKEN_EXPIRED' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true }),
      });

    await fetchWithAuth('/test');

    expect(auth.currentUser.getIdToken).toHaveBeenCalledTimes(2); // First call + refresh call
    expect(global.fetch).toHaveBeenCalledTimes(2);

    // Check second call headers
    expect(global.fetch).toHaveBeenLastCalledWith('/test', {
      headers: {
        Authorization: 'Bearer new-token',
      },
    });
  });
});

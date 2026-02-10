import { describe, it, expect } from 'vitest';
import { getBackendUrl } from './api';

describe('getBackendUrl', () => {
  it('returns base URL + endpoint when no params', () => {
    expect(getBackendUrl('/test')).toBe('http://localhost:3000/test');
  });

  it('appends params correctly', () => {
    expect(getBackendUrl('/test', { page: 1 })).toBe('http://localhost:3000/test?page=1');
  });

  it('handles multiple params', () => {
    expect(getBackendUrl('/test', { page: 1, limit: 10 })).toBe('http://localhost:3000/test?page=1&limit=10');
  });

  it('encodes params', () => {
    // URLSearchParams encodes space as + by default, which is standard for query params
    expect(getBackendUrl('/test', { search: 'hello world' })).toBe('http://localhost:3000/test?search=hello+world');
  });

  it('ignores null/undefined values', () => {
    expect(getBackendUrl('/test', { page: 1, limit: null, sort: undefined })).toBe('http://localhost:3000/test?page=1');
  });
});

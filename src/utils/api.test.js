import { describe, it, expect } from 'vitest';
import { getBackendUrl } from './api';

describe('getBackendUrl', () => {
  it('should construct a URL with query parameters', () => {
    const url = getBackendUrl('/foo', { bar: 'baz' });
    expect(url).toBe('http://localhost:3000/foo?bar=baz');
  });

  it('should correctly encode parameters to prevent injection', () => {
    const url = getBackendUrl('/foo', { userid: 'a&b=c' });
    expect(url).toBe('http://localhost:3000/foo?userid=a%26b%3Dc');
  });

  it('should append parameters correctly when endpoint already has query params', () => {
    const url = getBackendUrl('/foo?a=b', { c: 'd' });
    expect(url).toBe('http://localhost:3000/foo?a=b&c=d');
  });

  it('should ignore null or undefined parameters', () => {
    const url = getBackendUrl('/foo', { a: null, b: undefined, c: 'd' });
    expect(url).toBe('http://localhost:3000/foo?c=d');
  });

  it('should return base URL with endpoint if no params provided', () => {
    const url = getBackendUrl('/foo');
    expect(url).toBe('http://localhost:3000/foo');
  });
});

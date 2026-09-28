import { describe, it, expect } from 'vitest';
import { validateDestinationUrl } from '../server/src/utils/urlValidator';
import { isReservedSlug, generateShortCode } from '../server/src/utils/codeGenerator';

describe('URL and Code Validation', () => {
  it('should accept valid https and http URLs', async () => {
    const res1 = await validateDestinationUrl('https://example.com/some/path?param=1');
    expect(res1.isValid).toBe(true);
    expect(res1.normalizedUrl).toBe('https://example.com/some/path?param=1');

    const res2 = await validateDestinationUrl('http://mysite.org/hello');
    expect(res2.isValid).toBe(true);
  });

  it('should reject unsafe protocols: javascript, data, file', async () => {
    const res1 = await validateDestinationUrl('javascript:alert("XSS")');
    expect(res1.isValid).toBe(false);
    expect(res1.error).toContain('Unsafe URL protocol');

    const res2 = await validateDestinationUrl('data:text/html,<script>alert(1)</script>');
    expect(res2.isValid).toBe(false);

    const res3 = await validateDestinationUrl('file:///C:/Windows/System32/cmd.exe');
    expect(res3.isValid).toBe(false);
  });

  it('should reject malformed non-URL strings', async () => {
    const res = await validateDestinationUrl('not-a-valid-url-at-all');
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('Invalid URL format');
  });

  it('should reject blocked domain list entries', async () => {
    const res = await validateDestinationUrl('https://malicious-phishing.com/steal-credentials');
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('blocked for security');
  });

  it('should identify reserved slug keywords', () => {
    expect(isReservedSlug('admin')).toBe(true);
    expect(isReservedSlug('dashboard')).toBe(true);
    expect(isReservedSlug('api')).toBe(true);
    expect(isReservedSlug('login')).toBe(true);
    expect(isReservedSlug('register')).toBe(true);
    expect(isReservedSlug('techfest2026')).toBe(false);
  });

  it('should generate random 6-character Base62 codes', () => {
    const code = generateShortCode(6);
    expect(code).toHaveLength(6);
    expect(/^[0-9a-zA-Z]+$/.test(code)).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';
import { externalLinkProps } from './links';

const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' };

describe('externalLinkProps', () => {
  it.each([
    'https://github.com/ShaileshParmar11',
    'http://example.com',
    'https://reactplay.io',
    'https://github.com/open-metadata/OpenMetadata/pulls?q=is%3Apr+is%3Amerged',
  ])('opens %s in a new tab with a safe rel', (href) => {
    expect(externalLinkProps(href)).toEqual(NEW_TAB);
  });

  it('matches the scheme case-insensitively', () => {
    expect(externalLinkProps('HTTPS://example.com')).toEqual(NEW_TAB);
    expect(externalLinkProps('HtTp://example.com')).toEqual(NEW_TAB);
  });

  it.each([
    ['in-page anchor', '#about'],
    ['mailto', 'mailto:shailesh.parmar.webdev@gmail.com'],
    ['same-origin file', '/Shailesh-Parmar-Resume.pdf'],
    ['relative path', 'about.html'],
  ])('leaves a %s in the current tab', (_label, href) => {
    expect(externalLinkProps(href)).toEqual({});
  });

  it('does not treat protocol-relative URLs as external', () => {
    // Documents current behaviour: the regex requires an explicit scheme, so a
    // protocol-relative URL would navigate in-tab. No such link exists in the
    // site's data; this test exists to make a future change deliberate.
    expect(externalLinkProps('//evil.example.com')).toEqual({});
  });

  it('sets rel on every new-tab link, so window.opener is never exposed', () => {
    const props = externalLinkProps('https://example.com') as typeof NEW_TAB;
    expect(props.rel).toContain('noopener');
    expect(props.rel).toContain('noreferrer');
  });
});

/**
 * Props that make a link open in a new tab.
 *
 * Applied only to links that leave the site (http/https). In-page anchors
 * (#about, #work) and mailto: links stay in the current tab — a new tab would
 * break scrolling for the former and leave a blank tab behind for the latter.
 *
 * `rel="noopener noreferrer"` keeps the opened page from reaching back via
 * window.opener and withholds the referrer.
 */
export function externalLinkProps(href: string) {
  if (!/^https?:\/\//i.test(href)) return {};
  return { target: '_blank', rel: 'noopener noreferrer' } as const;
}

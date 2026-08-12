import { describe, expect, it } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Nav } from './Nav';
import { setMediaMatches } from '../test/setup';

const SECTIONS = ['About', 'Work', 'Skills', 'Contact'];

function setup() {
  const user = userEvent.setup();
  const { container } = render(<Nav />);
  return {
    user,
    container,
    button: screen.getByRole('button'),
    panel: container.querySelector('#nav-menu') as HTMLElement,
    desktop: container.querySelector('.nav-links') as HTMLElement,
  };
}

describe('Nav', () => {
  it('lists sections in page order, so the menu never scrolls backwards', () => {
    const { desktop } = setup();
    const labels = [...desktop.querySelectorAll('a')]
      .map((a) => a.textContent!.trim())
      .filter((l) => SECTIONS.includes(l));
    expect(labels).toEqual(SECTIONS);
  });

  it('links the resume with a download attribute', () => {
    const { desktop } = setup();
    const resume = within(desktop).getByRole('link', { name: /résumé/i });
    expect(resume).toHaveAttribute('href', '/Shailesh-Parmar-Resume.pdf');
    expect(resume).toHaveAttribute('download');
  });

  describe('mobile menu', () => {
    it('starts closed', () => {
      const { button, panel } = setup();
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAccessibleName('Open menu');
      expect(button).toHaveTextContent('☰');
      expect(panel).not.toHaveClass('open');
    });

    it('points at the panel it controls', () => {
      const { button, panel } = setup();
      expect(button).toHaveAttribute('aria-controls', 'nav-menu');
      expect(panel).toHaveAttribute('id', 'nav-menu');
    });

    it('opens on click, swapping the icon and the accessible name', async () => {
      const { user, button, panel } = setup();
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(button).toHaveAccessibleName('Close menu');
      expect(button).toHaveTextContent('✕');
      expect(panel).toHaveClass('open');
    });

    it('closes again on a second click', async () => {
      const { user, button, panel } = setup();
      await user.click(button);
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(panel).not.toHaveClass('open');
    });

    it('offers every section plus the resume', async () => {
      const { user, button, panel } = setup();
      await user.click(button);
      const labels = [...panel.querySelectorAll('a')].map((a) => a.textContent!.trim());
      expect(labels).toEqual([...SECTIONS, 'Résumé ↓']);
    });

    it('closes when a section link is chosen', async () => {
      const { user, button, panel } = setup();
      await user.click(button);
      await user.click(within(panel).getByRole('link', { name: 'Skills' }));
      expect(panel).not.toHaveClass('open');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes when the resume is chosen', async () => {
      const { user, button, panel } = setup();
      await user.click(button);
      await user.click(within(panel).getByRole('link', { name: /résumé/i }));
      expect(panel).not.toHaveClass('open');
    });

    it('closes on Escape and returns focus to the button', async () => {
      const { user, button, panel } = setup();
      await user.click(button);
      await user.keyboard('{Escape}');
      expect(panel).not.toHaveClass('open');
      expect(button).toHaveFocus();
    });

    it('ignores Escape while already closed', async () => {
      const { user, button, panel } = setup();
      await user.keyboard('{Escape}');
      expect(panel).not.toHaveClass('open');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes when the viewport grows past the breakpoint', async () => {
      // Otherwise the panel is hidden by CSS while the button still reports
      // aria-expanded="true" from stale state.
      const { user, button, panel } = setup();
      await user.click(button);
      expect(panel).toHaveClass('open');

      act(() => setMediaMatches('(min-width: 861px)', true));

      expect(panel).not.toHaveClass('open');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });
});

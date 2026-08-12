import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Contact } from './Contact';

describe('Contact', () => {
  it('renders the closing headline across its line break', () => {
    render(<Contact />);
    // The <br /> yields no whitespace in textContent, so assert the parts.
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent("Let's build something");
    expect(heading).toHaveTextContent('worth shipping.');
  });

  it('offers the resume as a download', () => {
    render(<Contact />);
    const resume = screen.getByRole('link', { name: /download résumé/i });
    expect(resume).toHaveAttribute('href', '/Shailesh-Parmar-Resume.pdf');
    expect(resume).toHaveAttribute('download');
  });

  it('links email directly rather than opening a blank tab', () => {
    render(<Contact />);
    const hello = screen.getByRole('link', { name: /say hello/i });
    expect(hello).toHaveAttribute('href', 'mailto:shailesh.parmar.webdev@gmail.com');
    expect(hello).not.toHaveAttribute('target');
  });
});

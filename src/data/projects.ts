import type { Project } from '../types';

export const projects: Project[] = [
  {
    tag: 'CORE UI COMMITTER · 15k+ ⭐',
    title: 'OpenMetadata — Data Observability UI',
    description:
      'Architected and own the Data Quality, Data Profiler, Incident Manager, and Column-Level Lineage experiences on the open-source data platform built by Collate — plus the Playwright test infrastructure the whole team relies on.',
    chips: ['React', 'TypeScript', 'D3.js', 'Playwright', 'Data Viz'],
    links: [
      {
        label: 'Repository ↗',
        href: 'https://github.com/open-metadata/OpenMetadata',
      },
      {
        label: 'My contributions ↗',
        href: 'https://github.com/open-metadata/OpenMetadata/pulls?q=is%3Apr+author%3AShaileshParmar11+is%3Amerged',
      },
    ],
    featured: true,
  },
  {
    tag: '650+ USERS',
    title: 'Code Snippet Builder',
    description:
      'A drag-and-drop builder for creating and sharing beautiful code snippets, used by 650+ people.',
    chips: ['React', 'TypeScript', 'Chakra UI', 'Appwrite'],
    links: [{ label: 'Live site ↗', href: 'https://snippetbuilder.com' }],
  },
  {
    tag: 'OPEN SOURCE',
    title: 'ReactPlay',
    description:
      'A community platform where developers learn and share ReactJS projects — I contribute to the frontend.',
    chips: ['React', 'TypeScript', 'Tailwind CSS'],
    links: [{ label: 'Live site ↗', href: 'https://reactplay.io' }],
  },
];

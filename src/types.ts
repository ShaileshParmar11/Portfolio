export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  /** Small uppercase label above the title, e.g. "650+ USERS". */
  tag: string;
  title: string;
  description: string;
  /** Tech chips rendered under the description. */
  chips: string[];
  links: ProjectLink[];
  /** Featured cards span the full grid width and get the gradient background. */
  featured?: boolean;
}

export interface Skill {
  category: string;
  items: string[];
}

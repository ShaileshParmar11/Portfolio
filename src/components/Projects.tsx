import { projects } from '../data/projects';
import { useReveal } from '../hooks/useReveal';
import type { Project } from '../types';
import { externalLinkProps } from '../utils/links';

function ProjectCard({ project }: { project: Project }) {
  const { ref, revealClass } = useReveal<HTMLDivElement>();

  return (
    <div
      className={`card ${project.featured ? 'feature ' : ''}${revealClass}`}
      ref={ref}
    >
      <span className="tag">{project.tag}</span>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="chips">
        {project.chips.map((chip) => (
          <span className="chip" key={chip}>
            {chip}
          </span>
        ))}
      </div>
      <div className="card-links">
        {project.links.map((link) => (
          <a key={link.href} href={link.href} {...externalLinkProps(link.href)}>
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function Projects() {
  const head = useReveal<HTMLDivElement>();

  return (
    <section className="blk" id="work">
      <div className="wrap">
        <div className={`sec-head ${head.revealClass}`} ref={head.ref}>
          <span className="sec-num">02</span>
          <h2 className="sec-title">Selected work</h2>
        </div>
        <div className="proj-grid">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

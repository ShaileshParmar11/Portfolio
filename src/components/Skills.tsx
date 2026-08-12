import { skills } from '../data/skills';
import { useReveal } from '../hooks/useReveal';
import type { Skill } from '../types';

function SkillCategory({ skill }: { skill: Skill }) {
  const { ref, revealClass } = useReveal<HTMLDivElement>();

  return (
    <div className={`skill-cat ${revealClass}`} ref={ref}>
      <h4>{skill.category}</h4>
      <div className="chips">
        {skill.items.map((item) => (
          <span className="chip" key={item}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  const head = useReveal<HTMLDivElement>();

  return (
    <section className="blk" id="skills">
      <div className="wrap">
        <div className={`sec-head ${head.revealClass}`} ref={head.ref}>
          <span className="sec-num">03</span>
          <h2 className="sec-title">Skills &amp; tech</h2>
        </div>
        <div className="skills-grid">
          {skills.map((skill) => (
            <SkillCategory key={skill.category} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
}

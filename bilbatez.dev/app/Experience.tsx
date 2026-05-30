import { Link } from 'react-router-dom';
import { experiences } from './content';
import type { ExperienceEntry, Position } from './content';

function ExperiencePositionsComponent({
  positions,
}: {
  positions: Position[];
}) {
  return positions.map((position) => (
    <li key={position.title} className="ml-6 mt-1 mb-6">
      <div className="mb-1 mt-3">
        <b>{position.title}</b>
        <br />
        <i className="text-sm">{position.period}</i>
      </div>
      <ul className="list-disc list-inside">
        {position.descriptions.map((description) => (
          <li key={position.title + description}>{description}</li>
        ))}
      </ul>
    </li>
  ));
}

function ExperiencesComponent() {
  return experiences.map((experience: ExperienceEntry) => (
    <li key={experience.company} className="mt-4">
      {experience.link ? (
        <Link
          className="pointer-events-auto"
          to={experience.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="font-bold">{experience.company}</span>
        </Link>
      ) : (
        <span className="font-bold">{experience.company}</span>
      )}
      <br />
      <span className="text-sm">{experience.location}</span>
      <br />
      <span className="font-italic text-sm">
        {experience.skills.join(' · ')}
      </span>
      <br />
      <ul>
        <ExperiencePositionsComponent positions={experience.positions} />
      </ul>
    </li>
  ));
}

export function Experience() {
  return (
    <article id="experience">
      <ul className="mt-4 list-inside">
        <ExperiencesComponent />
      </ul>
    </article>
  );
}

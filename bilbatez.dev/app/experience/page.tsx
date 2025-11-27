'use-client';

import Link from 'next/link';
import data from 'public/data/experience.json';

type Experience = {
  company: string;
  link?: string;
  skills: string[];
  location: string;
  positions: Position[];
};

type Position = {
  title: string;
  period: string;
  descriptions: string[];
};

export default function Experience() {
  const experiences: Experience[] = data;

  function ExperiencePositionsComponent({
    positions,
  }: {
    positions: Position[];
  }) {
    return positions.map((position: Position) => {
      return (
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
      );
    });
  }

  function ExperiencesComponent() {
    return experiences.map((experience) => {
      return (
        <li key={experience.company} className="mt-4">
          <Link
            className={`${experience.link ? 'pointer-events-auto' : 'cursor-text'}`}
            href={`${experience.link ? experience.link : ''}`}
            target="_blank"
          >
            <span className="font-bold">{experience.company}</span>
          </Link>
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
      );
    });
  }

  return (
    <article id="experience">
      <ul className="mt-4 list-inside">
        <ExperiencesComponent />
      </ul>
    </article>
  );
}

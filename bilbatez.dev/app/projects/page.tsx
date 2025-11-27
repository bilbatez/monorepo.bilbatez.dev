'use client';

import Link from 'next/link';
import data from 'public/data/projects.json';

type Project = {
  title: string;
  link: string;
  description: string;
};

export default function Projects() {
  const projects: readonly Project[] = data;

  function ProjectItemComponents() {
    return projects.map((project) => {
      return (
        <li key={project.title}>
          <b>
            <Link href={project.link}>[{project.title}]</Link>
          </b>
          : {project.description}
        </li>
      );
    });
  }

  return (
    <article id="projects">
      <p>Here are the tech projects that I&apos;ve worked on!</p>
      <ul className="mt-4 list-disc list-inside">
        <ProjectItemComponents />
      </ul>
    </article>
  );
}

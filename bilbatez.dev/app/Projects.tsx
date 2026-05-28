import { Link } from 'react-router-dom';

type Project = {
  title: string;
  link: string;
  description: string;
};

const projects: readonly Project[] = [
  {
    title: 'KPR for Dummies',
    link: 'https://github.com/bilbatez/monorepo.bilbatez.dev/tree/main/kprfordummies',
    description: 'Home mortgage calculator based on Indonesia.',
  },
  {
    title: 'Impractical Python Projects',
    link: 'https://github.com/bilbatez/impractical-python-projects',
    description: 'A collection of small python scripts.',
  },
  {
    title: 'And other stuffs on my github...',
    link: 'https://github.com/bilbatez',
    description: "I don't remember all of them hehe...",
  },
];

function ProjectItemComponents() {
  return projects.map((project) => (
    <li key={project.title}>
      <b>
        <Link to={project.link}>[{project.title}]</Link>
      </b>
      : {project.description}
    </li>
  ));
}

export function Projects() {
  return (
    <article id="projects">
      <p>Here are the tech projects that I&apos;ve worked on!</p>
      <ul className="mt-4 list-disc list-inside">
        <ProjectItemComponents />
      </ul>
    </article>
  );
}

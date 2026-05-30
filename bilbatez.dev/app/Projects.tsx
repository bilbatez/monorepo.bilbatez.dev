import { Link } from 'react-router-dom';
import { projects, projectsIntro } from './content';
import type { ProjectEntry } from './content';

function ProjectItemComponents() {
  return projects.map((project: ProjectEntry) => (
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
      <p>{projectsIntro}</p>
      <ul className="mt-4 list-disc list-inside">
        <ProjectItemComponents />
      </ul>
    </article>
  );
}

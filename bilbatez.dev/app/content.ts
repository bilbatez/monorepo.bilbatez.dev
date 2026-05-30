import yaml from 'js-yaml';
import { marked } from 'marked';

import homeRaw from '../content/en/home.md?raw';
import experienceRaw from '../content/en/experience.md?raw';
import projectsRaw from '../content/en/projects.md?raw';

export interface Position {
  title: string;
  period: string;
  descriptions: string[];
}

export interface ExperienceEntry {
  company: string;
  link?: string;
  skills: string[];
  location: string;
  positions: Position[];
}

export interface ProjectEntry {
  title: string;
  link: string;
  description: string;
}

function parseFrontmatter<T>(raw: string): { data: T; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {} as T, content: raw };
  return {
    data: (yaml.load(match[1]) ?? {}) as T,
    content: match[2],
  };
}

marked.use({
  renderer: {
    link(token) {
      const titleAttr = token.title ? ` title="${token.title}"` : '';
      return `<a href="${token.href}"${titleAttr} target="_blank" rel="noopener noreferrer">${token.text}</a>`;
    },
  },
});

export const homeHTML = marked(homeRaw) as string;

const expData = parseFrontmatter<{ experiences: ExperienceEntry[] }>(
  experienceRaw
);
export const experiences = expData.data.experiences;

const projData = parseFrontmatter<{ intro: string; projects: ProjectEntry[] }>(
  projectsRaw
);
export const projects = projData.data.projects;
export const projectsIntro = projData.data.intro;

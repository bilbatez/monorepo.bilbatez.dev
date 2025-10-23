import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { Footer } from './components/footer';
import { Nav } from './components/nav';
import { Title } from './components/title';

export class ProjectsPage {
  constructor(
    public readonly page: Page,
    public readonly title: Title,
    public readonly nav: Nav,
    public readonly footer: Footer
  ) {}

  async hasProjectsContent() {
    const projects = this.page.getByRole('article');
    await expect(projects).toBeVisible();
    await expect(projects.getByRole('listitem')).toHaveCount(3);
  }

  static factory(page: Page): ProjectsPage {
    return new ProjectsPage(
      page,
      new Title(page),
      new Nav(page),
      new Footer(page)
    );
  }
}

import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { Nav } from './components/nav';

export class CategoryListPage {
  constructor(
    public readonly page: Page,
    public readonly nav: Nav
  ) {}

  /** Links that navigate to algorithm detail pages within the current category. */
  private algorithmCardLinks() {
    // Cards are <Link to="/:category/:slug"> rendered as <a> inside the grid
    return this.page.locator('main a[href*="/"]').filter({
      has: this.page.locator('h2'),
    });
  }

  async hasAlgorithmCards() {
    await expect(this.algorithmCardLinks().first()).toBeVisible();
  }

  async hasAlgorithmCount(expected: number) {
    await expect(this.algorithmCardLinks()).toHaveCount(expected, {
      timeout: 5000,
    });
  }

  async algorithmCardCount() {
    return this.algorithmCardLinks().count();
  }

  async hasCategoryHeading(name: string) {
    await expect(
      this.page.getByRole('heading', { name: new RegExp(name, 'i'), level: 1 })
    ).toBeVisible();
  }

  async navigatesToAlgorithm(slug: string) {
    await this.page
      .getByRole('link', { name: new RegExp(slug.replace(/-/g, ' '), 'i') })
      .first()
      .click();
  }

  static factory(page: Page): CategoryListPage {
    return new CategoryListPage(page, new Nav(page));
  }
}

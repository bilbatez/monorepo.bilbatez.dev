import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { Footer } from './components/footer';
import { Nav } from './components/nav';
import { Title } from './components/title';

export class HomePage {
  constructor(
    public readonly page: Page,
    public readonly title: Title,
    public readonly nav: Nav,
    public readonly footer: Footer
  ) {}

  async hasIntroContent() {
    const intro = this.page.locator('#intro');
    await expect(intro).toBeVisible();
    await expect(intro.getByRole('paragraph')).toHaveCount(5);
  }

  static factory(page: Page): HomePage {
    return new HomePage(page, new Title(page), new Nav(page), new Footer(page));
  }
}

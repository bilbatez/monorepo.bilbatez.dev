import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { Footer } from './components/footer';
import { Form } from './components/form';
import { Nav } from './components/nav';

export class HomePage {
  constructor(
    public readonly page: Page,
    public readonly nav: Nav,
    public readonly form: Form,
    public readonly footer: Footer
  ) {}

  async hasValidTitle() {
    const title = this.page.locator('h1');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('Kalkulator KPR');
  }

  static factory(page: Page): HomePage {
    return new HomePage(page, new Nav(page), new Form(page), new Footer(page));
  }
}

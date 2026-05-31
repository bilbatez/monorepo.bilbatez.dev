import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class Nav {
  constructor(public readonly page: Page) {}

  async gotoWebsite() {
    await this.page.goto('http://localhost:3003');
  }

  async gotoCategory(category: string) {
    await this.page.goto(`http://localhost:3003/${category}`);
  }

  async gotoAlgorithm(category: string, slug: string) {
    await this.page.goto(`http://localhost:3003/${category}/${slug}`);
  }

  async sidebarIsVisible() {
    await expect(this.page.locator('aside')).toBeVisible();
  }

  async hasAlgorithmCompendiumTitle() {
    await expect(
      this.page.getByText('Algorithm Compendium').first()
    ).toBeVisible();
  }

  async sidebarTitleNavigatesHome() {
    // Sidebar title is a <Link to="/"> — click it, verify URL lands on home
    const sidebarTitle = this.page.locator('aside a[href="/"]').first();
    await expect(sidebarTitle).toBeVisible();
    await sidebarTitle.click();
    await this.page.waitForURL('http://localhost:3003/');
    await expect(
      this.page.getByRole('heading', { name: /algorithm compendium/i })
    ).toBeVisible();
  }

  async canCollapseAndExpandSidebar() {
    const collapseBtn = this.page.getByRole('button', { name: /collapse/i });
    await expect(collapseBtn).toBeVisible();
    await collapseBtn.click();
    // Sidebar narrows — text labels hidden
    await expect(this.page.locator('aside')).toHaveClass(/w-14/, {
      timeout: 3000,
    });
    // Expand again
    const expandBtn = this.page.getByRole('button', { name: /expand/i });
    await expandBtn.click();
    await expect(this.page.locator('aside')).toHaveClass(/w-64/, {
      timeout: 3000,
    });
  }
}

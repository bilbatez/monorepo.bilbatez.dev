import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { Nav } from './components/nav';

export class AlgorithmDetailPage {
  constructor(
    public readonly page: Page,
    public readonly nav: Nav
  ) {}

  /** Open the Overview collapsible if it is currently collapsed. */
  async openOverview() {
    const complexityLabel = this.page.getByText('Complexity', { exact: true });
    const isOpen = await complexityLabel.isVisible().catch(() => false);
    if (!isOpen) {
      await this.page.getByRole('button', { name: /overview/i }).click();
      await expect(complexityLabel).toBeVisible();
    }
  }

  async hasAlgorithmName() {
    await expect(this.page.getByRole('heading', { level: 1 })).toBeVisible();
  }

  async hasComplexityInfo() {
    await this.openOverview();
    await expect(this.page.getByText(/best/i).first()).toBeVisible();
    await expect(this.page.getByText(/worst/i).first()).toBeVisible();
  }

  async hasPseudocode() {
    await this.openOverview();
    await expect(
      this.page.getByText('Pseudocode', { exact: true })
    ).toBeVisible();
    await expect(this.page.locator('pre').first()).toBeVisible();
  }

  async overviewToggles() {
    const btn = this.page.getByRole('button', { name: /overview/i });
    await expect(btn).toBeVisible();

    // Ensure closed first
    const complexityLabel = this.page.getByText('Complexity', { exact: true });
    if (await complexityLabel.isVisible().catch(() => false)) {
      await btn.click();
      await expect(complexityLabel).not.toBeVisible();
    }

    // Open
    await btn.click();
    await expect(complexityLabel).toBeVisible();

    // Close again
    await btn.click();
    await expect(complexityLabel).not.toBeVisible();
  }

  async hasVisualizerSection() {
    await expect(
      this.page.getByText('Visualizer', { exact: true })
    ).toBeVisible();
  }

  async hasVisualizerArea() {
    const visualizer = this.page
      .locator('.flex.items-end')
      .or(this.page.locator('svg').first())
      .or(this.page.locator('table').first());
    await expect(visualizer.first()).toBeVisible({ timeout: 5000 });
  }

  async hasPlayControls() {
    await expect(
      this.page.getByRole('button', { name: /play|pause/i }).first()
    ).toBeVisible();
  }

  async canPlay() {
    const playBtn = this.page.getByRole('button', { name: 'Play' }).first();
    await expect(playBtn).toBeVisible();
    await playBtn.click();
    await expect(
      this.page.getByRole('button', { name: 'Pause' }).first()
    ).toBeVisible();
    // Reset to paused state
    await this.page.getByRole('button', { name: 'Pause' }).first().click();
  }

  async canStepForward() {
    const stepBtn = this.page.getByRole('button', { name: 'Step forward' });
    await expect(stepBtn).toBeEnabled();
    await stepBtn.click();
  }

  async canReset() {
    await this.page.getByRole('button', { name: 'Reset' }).click();
  }

  async categoryBadgeIsVisible() {
    const badge = this.page
      .locator('a[href^="/"]')
      .filter({
        hasText: /sorting|searching|graph|tree|dynamic|string|backtrack|math/i,
      })
      .first();
    await expect(badge).toBeVisible();
  }

  static factory(page: Page): AlgorithmDetailPage {
    return new AlgorithmDetailPage(page, new Nav(page));
  }
}

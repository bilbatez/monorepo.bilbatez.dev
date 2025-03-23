import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

enum AvailableNav {
  FLAT = "Suku Bunga Flat",
  EFFECTIVE = "Suku Bunga Efektif",
  ANNUITY = "Suku Bunga Anuitas",
}

export class Nav {
  constructor(public readonly page: Page) {}

  async gotoWebsite() {
    await this.page.goto("http://localhost:3002");
  }

  async gotoHome() {
    await this.page.getByRole("heading").getByText("Kalkulator KPR").click();
  }

  async gotoFlatForm() {
    await this.page.getByRole("button").getByText(AvailableNav.FLAT).click();
  }

  async gotoEffective() {
    await this.page
      .getByRole("button")
      .getByText(AvailableNav.EFFECTIVE)
      .click();
  }

  async gotoAnnuity() {
    await this.page.getByRole("button").getByText(AvailableNav.ANNUITY).click();
  }

  async hasValidNavsForFlatForm() {
    await this.hasValidNavs(AvailableNav.FLAT);
  }

  async hasValidNavsForEffective() {
    await this.hasValidNavs(AvailableNav.EFFECTIVE);
  }

  async hasValidNavsForAnnuity() {
    await this.hasValidNavs(AvailableNav.ANNUITY);
  }

  async hasValidNavs(currentActivePage: AvailableNav | null = null) {
    for (const nav of Object.values(AvailableNav)) {
      const navButton = this.page.getByRole("button").getByText(nav);
      await expect(navButton).toBeVisible();
      if (currentActivePage == nav) await expect(navButton).toBeDisabled();
      else await expect(navButton).toBeEnabled();
    }
  }
}

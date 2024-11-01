import { expect, Page } from "@playwright/test";

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

  async gotoFlat() {
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

  async hasValidNavs() {
    for (const nav of Object.values(AvailableNav)) {
      const navButton = this.page.getByText(nav);
      await expect(navButton).toBeVisible();
      await expect(navButton).toBeEnabled();
    }
  }
}

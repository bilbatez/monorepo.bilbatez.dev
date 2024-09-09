import { Page } from "@playwright/test";

enum AvailableNav {
  HOME = "Kalkulator KPR",
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
    await this.page.getByRole("heading").getByText(AvailableNav.HOME).click();
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
      await expect(this.page.getByLabel(nav)).toBeVisible();
    }
  }
}

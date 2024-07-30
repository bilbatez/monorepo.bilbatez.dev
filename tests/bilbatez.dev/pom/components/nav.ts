import { expect, Page } from "@playwright/test";

enum AvailableNav {
  HOME = "Intro",
  EXPERIENCE = "Corpo Exp",
  PROJECTS = "Prjx",
}

export class Nav {
  constructor(public readonly page: Page) {}

  async gotoWebsite() {
    await this.page.goto("http://localhost:3001");
  }

  async gotoHome() {
    await this.page.getByRole("link").getByText(AvailableNav.HOME).click();
  }

  async gotoExperience() {
    await this.page
      .getByRole("link")
      .getByText(AvailableNav.EXPERIENCE)
      .click();
  }

  async gotoProjects() {
    await this.page.getByRole("link").getByText(AvailableNav.PROJECTS).click();
  }

  async hasValidNavs() {
    const navLinks = this.page.getByRole("navigation").getByRole("link");
    await expect(navLinks).toHaveCount(3);
    for (const nav of Object.values(AvailableNav)) {
      await expect(navLinks.getByText(nav)).toBeVisible();
    }
  }
}

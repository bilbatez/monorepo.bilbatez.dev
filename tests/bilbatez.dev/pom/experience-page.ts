import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { Footer } from "./components/footer";
import { Nav } from "./components/nav";
import { Title } from "./components/title";

export class ExperiencePage {
  constructor(
    public readonly page: Page,
    public readonly title: Title,
    public readonly nav: Nav,
    public readonly footer: Footer,
  ) {}

  async hasExperienceContent() {
    const experience = this.page.locator("#experience");
    await expect(experience).toBeVisible();
    await expect(experience.getByRole("listitem")).toHaveCount(12);
  }

  static factory(page: Page): ExperiencePage {
    return new ExperiencePage(
      page,
      new Title(page),
      new Nav(page),
      new Footer(page),
    );
  }
}

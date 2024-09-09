import { expect, Page } from "@playwright/test";
import { Nav } from "./components/nav";

export class HomePage {
  constructor(public readonly page: Page, public readonly nav: Nav) {}

  async hasValidTitle() {
    const title = this.page.locator("h1");
    await expect(title).toBeVisible();
    await expect(title).toHaveText("Kalkulator KPR");
  }

  static factory(page: Page): HomePage {
    return new HomePage(page, new Nav(page));
  }
}

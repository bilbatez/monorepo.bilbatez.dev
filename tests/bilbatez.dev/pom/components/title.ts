import { expect, Page } from "@playwright/test";

export class Title {
  constructor(public readonly page: Page) {}

  async hasValidTitle() {
    await expect(this.page).toHaveTitle(/Bilbatez.dev/);
    await expect(this.page.getByRole("heading", { level: 1 })).toHaveText(
      /BILBATEZ\.DEV/
    );
  }
}

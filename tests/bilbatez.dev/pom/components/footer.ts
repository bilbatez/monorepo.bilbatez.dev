import { expect, Page } from "@playwright/test";

export class Footer {
  constructor(public readonly page: Page) {}

  async hasValidFooter() {
    const footer = this.page.getByRole("contentinfo");
    await expect(footer.getByRole("heading", { level: 2 })).toHaveText(
      /Socials/,
    );
    await expect(footer.getByRole("listitem")).toHaveCount(2);
  }
}

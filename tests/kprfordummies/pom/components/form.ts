import { Page } from "@playwright/test";

const enum AvailableInput {
  PRINCIPAL = "principal",
}

export class Form {
  constructor(public readonly page: Page) {}

  async input(selector: string, value: string) {
    await this.page.locator(selector).fill(value);
  }
}

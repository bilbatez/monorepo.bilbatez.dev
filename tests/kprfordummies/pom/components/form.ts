import { Locator, Page } from "@playwright/test";

const enum AvailableInput {
  PRINCIPAL = "principal",
}

export class Form {
  constructor(public readonly page: Page) {}

  private getInputField(selector: string): Locator {
    return this.page.getByLabel(selector);
  }

  async input(selector: string, value: string) {
    await this.getInputField(selector).fill(value);
  }

  async inputPrincipal(value: string) {
    await this.input(AvailableInput.PRINCIPAL, value);
  }

  async inputInterestRate(value: string) {
    await this.input("input[name='interestRate']", value);
  }
}

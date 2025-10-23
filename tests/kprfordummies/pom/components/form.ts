import { expect, type Locator, type Page } from '@playwright/test';

export class Form {
  constructor(public readonly page: Page) {}

  private async getInputField(name: string): Promise<Locator> {
    return this.page.locator(`input[name="${name}"]`);
  }

  private async getButton(name: string): Promise<Locator> {
    return this.page.getByRole('button').getByText(name, { exact: true });
  }

  async getPrincipalInputField(): Promise<Locator> {
    return this.getInputField('principal');
  }

  async getInterestInputField(index: number = 0): Promise<Locator> {
    return this.getInputField(`interestPeriod.${index}.interest`);
  }

  async getPeriodInputField(index: number = 0): Promise<Locator> {
    return this.getInputField(`interestPeriod.${index}.period`);
  }

  async getAddInterestPeriodButton(): Promise<Locator> {
    return this.getButton('Tambah Suku Bunga');
  }

  async getRemoveInterestPeriodButton(): Promise<Locator> {
    return this.getButton('Hapus Suku Bunga');
  }

  async getStartDateInputField(): Promise<Locator> {
    return this.getInputField('startDate');
  }

  async getCalculateButton(): Promise<Locator> {
    return this.getButton('Kalkulasi');
  }

  async getResetButton(): Promise<Locator> {
    return this.getButton('Ulangi');
  }

  async getNextPageButton(): Promise<Locator> {
    return this.getButton('>');
  }

  async getLastPageButton(): Promise<Locator> {
    return this.getButton('>>');
  }

  async validateErrorMessage(field: string, em: string) {
    const el = this.page
      .locator(`label[for="${field}"]`)
      .locator('.error-message');
    await expect(el).toBeVisible();
    await expect(el).toHaveText(em);
  }

  async validatePrincipalErrorMessage(em: string) {
    await this.validateErrorMessage('principal', em);
  }

  async validateInterestErrorMessage(index: number = 0, em: string) {
    await this.validateErrorMessage(`interestPeriod.${index}.interest`, em);
  }

  async validatePeriodErrorMessage(index: number = 0, em: string) {
    await this.validateErrorMessage(`interestPeriod.${index}.period`, em);
  }

  async validateInterestPeriodErrorMessage(index: number = 0, em: string) {
    await this.validateErrorMessage(`interestPeriod.${index}.period`, em);
  }

  async validateCalculationSummary(
    principal: string,
    totalInterest: string,
    totalPayment: string
  ) {
    const pairs = {
      'Pokok Pinjaman:': principal,
      'Total Bunga yang dibayarkan:': totalInterest,
      'Total Keseluruhan:': totalPayment,
    };
    for (const [label, expectedValue] of Object.entries(pairs)) {
      const value = this.page.locator(
        `//div[text()="${label}"]/following-sibling::div[1]`
      );
      await expect(value).toHaveText(expectedValue);
    }
  }

  async validateStartDateInitialValue() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const expectedDate = `${year}-${month}-${day}`;
    await expect(await this.getStartDateInputField()).toBeVisible();
    await expect(await this.getStartDateInputField()).toHaveValue(expectedDate);
  }

  async validateAmortizationScheduleTableRow(
    period: number,
    date: string,
    payment: string,
    principal: string,
    interest: string,
    initialBalance: string,
    finalBalance: string
  ) {
    const row = this.page.locator(`//tr[
  td[1][normalize-space(text())="${period}"] and
  td[2][normalize-space(translate(text(), '\u00A0', ' '))="${date}"] and
  td[3][normalize-space(translate(text(), '\u00A0', ' '))="${payment}"] and
  td[4][normalize-space(translate(text(), '\u00A0', ' '))="${principal}"] and
  td[5][normalize-space(translate(text(), '\u00A0', ' '))="${interest}"] and
  td[6][normalize-space(translate(text(), '\u00A0', ' '))="${initialBalance}"] and
  td[7][normalize-space(translate(text(), '\u00A0', ' '))="${finalBalance}"]
]`);

    await expect(row).toHaveCount(1);
  }

  async hasValidInitialForm() {
    for (const element of [
      this.getPrincipalInputField(),
      this.getInterestInputField(),
      this.getPeriodInputField(),
    ]) {
      await expect(await element).toBeVisible();
      await expect(await element).toHaveValue('');
    }

    await this.validateStartDateInitialValue();

    for (const element of [
      this.getAddInterestPeriodButton(),
      this.getCalculateButton(),
      this.getResetButton(),
    ]) {
      await expect(await element).toBeVisible();
    }
  }
}

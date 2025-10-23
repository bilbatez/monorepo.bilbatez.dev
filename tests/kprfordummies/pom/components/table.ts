import { type Page } from '@playwright/test';

export class Table {
  constructor(public readonly page: Page) {}
}

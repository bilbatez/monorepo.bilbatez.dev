import { test as base } from "@playwright/test";
import { HomePage } from "../pom/home-page";

const test = base.extend<{ homePage: HomePage }>({
  homePage: async ({ page }, use) => {
    const homePage = HomePage.factory(page);
    await homePage.nav.gotoWebsite();
    await use(homePage);
  },
});

test.describe("Home page", async () => {
  test("has valid content", async ({ homePage }) => {
    await homePage.hasValidTitle();
    await homePage.nav.hasValidNavs();
    await homePage.footer.hasValidFooter();
  });
});

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
  test("has title", async ({ homePage }) => {
    await homePage.title.hasValidTitle();
  });

  test("has navbar", async ({ homePage }) => {
    await homePage.nav.hasValidNavs();
  });

  test("has intro content", async ({ homePage }) => {
    await homePage.hasIntroContent();
  });

  test("has footer", async ({ homePage }) => {
    await homePage.footer.hasValidFooter();
  });

  test("navbar redirection is correct", async ({ homePage }) => {
    await homePage.nav.gotoHome();
    await homePage.title.hasValidTitle();
    await homePage.nav.hasValidNavs();
    await homePage.hasIntroContent();
    await homePage.footer.hasValidFooter();
  });
});

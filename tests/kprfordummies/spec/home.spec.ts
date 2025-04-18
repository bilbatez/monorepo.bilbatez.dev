import { HomePage } from "@/kprfordummies/pom/home-page";
import { test as base } from "@playwright/test";

const test = base.extend<{ homePage: HomePage }>({
  homePage: async ({ page }, use) => {
    const homePage = HomePage.factory(page);
    await homePage.nav.gotoWebsite();
    await use(homePage);
  },
});

test.describe("Home page", async () => {
  test("has valid navigation & content", async ({ homePage }) => {
    await homePage.hasValidTitle();
    await homePage.nav.hasValidNavs();
    await homePage.footer.hasValidFooter();
  });
});

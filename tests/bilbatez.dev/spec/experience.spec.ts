import { ExperiencePage } from "@/bilbatez.dev/pom/experience-page";
import { test as base } from "@playwright/test";

const test = base.extend<{ experiencePage: ExperiencePage }>({
  experiencePage: async ({ page }, use) => {
    const experiencePage = ExperiencePage.factory(page);
    await experiencePage.nav.gotoWebsite();
    await experiencePage.nav.gotoExperience();
    await use(experiencePage);
  },
});

test.describe("Experience page", async () => {
  test("has title", async ({ experiencePage }) => {
    await experiencePage.title.hasValidTitle();
  });

  test("has navbar", async ({ experiencePage }) => {
    await experiencePage.nav.hasValidNavs();
  });

  test("has experience content", async ({ experiencePage }) => {
    await experiencePage.hasExperienceContent();
  });

  test("has footer", async ({ experiencePage }) => {
    await experiencePage.footer.hasValidFooter();
  });
});

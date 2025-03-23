import { ProjectsPage } from "@/bilbatez.dev/pom/projects-page";
import { test as base } from "@playwright/test";

const test = base.extend<{ projectsPage: ProjectsPage }>({
  projectsPage: async ({ page }, use) => {
    const projectsPage = ProjectsPage.factory(page);
    await projectsPage.nav.gotoWebsite();
    await projectsPage.nav.gotoProjects();
    await use(projectsPage);
  },
});

test.describe("Projects page", async () => {
  test("has title", async ({ projectsPage }) => {
    await projectsPage.title.hasValidTitle();
  });

  test("has navbar", async ({ projectsPage }) => {
    await projectsPage.nav.hasValidNavs();
  });

  test("has projects content", async ({ projectsPage }) => {
    await projectsPage.hasProjectsContent();
  });

  test("has footer", async ({ projectsPage }) => {
    await projectsPage.footer.hasValidFooter();
  });
});

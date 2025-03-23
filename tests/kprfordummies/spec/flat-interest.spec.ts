import { ErrorMessage } from "@kprfordummies/constants/error-messages";
import { test as base } from "@playwright/test";
import { HomePage } from "../pom/home-page";

const test = base.extend<{ homePage: HomePage }>({
  homePage: async ({ page }, use) => {
    const homePage = HomePage.factory(page);
    await homePage.nav.gotoWebsite();
    await homePage.nav.gotoFlatForm();
    await use(homePage);
  },
});

test.describe("Flat Interest Calculator", async () => {
  test("has correct initial form interface", async ({ homePage }) => {
    await homePage.hasValidTitle();
    await homePage.nav.hasValidNavsForFlatForm();
    await homePage.form.hasValidInitialForm();
    await homePage.footer.hasValidFooter();
  });

  test.describe("form validation", async () => {
    test("shows error messages if calculate button is clicked without form input", async ({
      homePage,
    }) => {
      await (await homePage.form.getCalculateButton()).click();
      await homePage.form.validatePrincipalErrorMessage(ErrorMessage.REQUIRED);
      await homePage.form.validateInterestPeriodErrorMessage(
        0,
        ErrorMessage.REQUIRED,
      );
    });

    test.skip("has form resetted if rest button is clicked", async ({
      homePage,
    }) => {
      await (
        await homePage.form.getPrincipalInputField()
      ).fill(`${1_800_000_000}`);
      await (await homePage.form.getInterestInputField()).fill("8");
      await (await homePage.form.getPeriodInputField()).fill("10");
      await (await homePage.form.getAddInterestPeriodButton()).click();
      await (await homePage.form.getAddInterestPeriodButton()).click();
      await (await homePage.form.getResetButton()).click();
      await homePage.form.hasValidInitialForm();
    });

    test.describe("principal input", async () => {
      test("shows error message if input is not number", async ({
        homePage,
      }) => {
        await (await homePage.form.getPrincipalInputField()).fill("abc");
        await homePage.form.validatePrincipalErrorMessage(
          ErrorMessage.MUST_BE_NUMBER,
        );
      });

      test("shows error message if input is less than 0", async ({
        homePage,
      }) => {
        await (await homePage.form.getPrincipalInputField()).fill("-100");
        await homePage.form.validatePrincipalErrorMessage(
          ErrorMessage.MINIMUM_NUMBER(0),
        );
      });
    });

    test.describe("interest & period input", async () => {
      test("shows error message if input is not number", async ({
        homePage,
      }) => {
        await (await homePage.form.getInterestInputField()).fill("abc");
        await (await homePage.form.getPeriodInputField()).fill("abc");
        await homePage.form.validateInterestPeriodErrorMessage(
          0,
          ErrorMessage.MUST_BE_NUMBER,
        );
      });

      test("shows error message if input is less than default minimum number", async ({
        homePage,
      }) => {
        await (await homePage.form.getInterestInputField()).fill("-100");
        await (await homePage.form.getPeriodInputField()).fill("-100");
        await homePage.form.validateInterestErrorMessage(
          0,
          ErrorMessage.MINIMUM_NUMBER(0),
        );
        await homePage.form.validatePeriodErrorMessage(
          0,
          ErrorMessage.MINIMUM_NUMBER(1),
        );
      });

      test("shows error message if input is greater than default maximum number", async ({
        homePage,
      }) => {
        await (await homePage.form.getInterestInputField()).fill("31");
        await (await homePage.form.getPeriodInputField()).fill("151");
        await homePage.form.validateInterestErrorMessage(
          0,
          ErrorMessage.MAXIMUM_NUMBER(30),
        );
        await homePage.form.validatePeriodErrorMessage(
          0,
          ErrorMessage.MAXIMUM_NUMBER(150),
        );
      });

      test("shows error message if input is a fractional number", async ({
        homePage,
      }) => {
        await (await homePage.form.getInterestInputField()).fill("1.5");
        await (await homePage.form.getPeriodInputField()).fill("1.5");
        await homePage.form.validateInterestPeriodErrorMessage(
          0,
          ErrorMessage.MUST_BE_ROUND_NUMBER,
        );
      });
    });
  });

  test.describe("calculation", async () => {
    test.skip("has correct table result with a single flat interest period", async ({
      homePage,
    }) => {
      await (
        await homePage.form.getPrincipalInputField()
      ).fill(`${1_800_000_000}`);
      await (await homePage.form.getInterestInputField()).fill("8");
      await (await homePage.form.getPeriodInputField()).fill("10");
      await (await homePage.form.getCalculateButton()).click();
    });

    test.skip("has correct table result with multiple flat interest periods", async ({
      homePage,
    }) => {});
  });
});

import { ErrorMessage } from '@kprfordummies/constants/error-messages';
import { test as base } from '@playwright/test';
import { HomePage } from '../pom/home-page';

const test = base.extend<{ homePage: HomePage }>({
  homePage: async ({ page }, use) => {
    const homePage = HomePage.factory(page);
    await homePage.nav.gotoWebsite();
    await homePage.nav.gotoFlatForm();
    await use(homePage);
  },
});

test.describe('Flat Interest Calculator', async () => {
  test('has correct initial form interface', async ({ homePage }) => {
    await homePage.hasValidTitle();
    await homePage.nav.hasValidNavsForFlatForm();
    await homePage.form.hasValidInitialForm();
    await homePage.footer.hasValidFooter();
  });

  test.describe('form validation', async () => {
    test('shows error messages if calculate button is clicked without form input', async ({
      homePage,
    }) => {
      await (await homePage.form.getCalculateButton()).click();
      await homePage.form.validatePrincipalErrorMessage(ErrorMessage.REQUIRED);
      await homePage.form.validateInterestPeriodErrorMessage(
        0,
        ErrorMessage.REQUIRED
      );
    });

    test('has form resetted if rest button is clicked', async ({
      homePage,
    }) => {
      await (
        await homePage.form.getPrincipalInputField()
      ).fill(`${1_800_000_000}`);
      await (await homePage.form.getInterestInputField()).fill('8');
      await (await homePage.form.getPeriodInputField()).fill('10');
      await (await homePage.form.getAddInterestPeriodButton()).click();
      await (await homePage.form.getAddInterestPeriodButton()).click();
      await (await homePage.form.getResetButton()).click();
      await homePage.form.hasValidInitialForm();
    });

    test.describe('principal input', async () => {
      test('shows error message if input is not number', async ({
        homePage,
      }) => {
        await (await homePage.form.getPrincipalInputField()).fill('abc');
        await homePage.form.validatePrincipalErrorMessage(
          ErrorMessage.MUST_BE_NUMBER
        );
      });

      test('shows error message if input is less than 0', async ({
        homePage,
      }) => {
        await (await homePage.form.getPrincipalInputField()).fill('-100');
        await homePage.form.validatePrincipalErrorMessage(
          ErrorMessage.MINIMUM_NUMBER(0)
        );
      });
    });

    test.describe('interest & period input', async () => {
      test('shows error message if input is not number', async ({
        homePage,
      }) => {
        await (await homePage.form.getInterestInputField()).fill('abc');
        await (await homePage.form.getPeriodInputField()).fill('abc');
        await homePage.form.validateInterestPeriodErrorMessage(
          0,
          ErrorMessage.MUST_BE_NUMBER
        );
      });

      test('shows error message if input is less than default minimum number', async ({
        homePage,
      }) => {
        await (await homePage.form.getInterestInputField()).fill('-100');
        await (await homePage.form.getPeriodInputField()).fill('-100');
        await homePage.form.validateInterestErrorMessage(
          0,
          ErrorMessage.MINIMUM_NUMBER(0)
        );
        await homePage.form.validatePeriodErrorMessage(
          0,
          ErrorMessage.MINIMUM_NUMBER(1)
        );
      });

      test('shows error message if input is greater than default maximum number', async ({
        homePage,
      }) => {
        await (await homePage.form.getInterestInputField()).fill('31');
        await (await homePage.form.getPeriodInputField()).fill('151');
        await homePage.form.validateInterestErrorMessage(
          0,
          ErrorMessage.MAXIMUM_NUMBER(30)
        );
        await homePage.form.validatePeriodErrorMessage(
          0,
          ErrorMessage.MAXIMUM_NUMBER(150)
        );
      });

      test('shows error message if input is a fractional number', async ({
        homePage,
      }) => {
        await (await homePage.form.getInterestInputField()).fill('1.5');
        await (await homePage.form.getPeriodInputField()).fill('1.5');
        await homePage.form.validateInterestPeriodErrorMessage(
          0,
          ErrorMessage.MUST_BE_ROUND_NUMBER
        );
      });
    });
  });

  test.describe('calculation', async () => {
    test('has correct table result with a single flat interest period', async ({
      homePage,
    }) => {
      await (
        await homePage.form.getPrincipalInputField()
      ).fill(`${1_800_000_000}`);

      await (await homePage.form.getInterestInputField()).fill('8');
      await (await homePage.form.getPeriodInputField()).fill('10');

      await (await homePage.form.getStartDateInputField()).fill('2024-02-20');
      await (await homePage.form.getCalculateButton()).click();

      await homePage.form.validateCalculationSummary(
        'Rp 1.800.000.000,00',
        'Rp 1.440.000.000,00',
        'Rp 3.240.000.000,00'
      );

      await homePage.form.validateAmortizationScheduleTableRow(
        1,
        '20/02/2024',
        'Rp 27.000.000,00',
        'Rp 15.000.000,00',
        'Rp 12.000.000,00',
        'Rp 1.800.000.000,00',
        'Rp 1.785.000.000,00'
      );
      await (await homePage.form.getNextPageButton()).click();

      await homePage.form.validateAmortizationScheduleTableRow(
        62,
        '20/03/2029',
        'Rp 27.000.000,00',
        'Rp 15.000.000,00',
        'Rp 12.000.000,00',
        'Rp 885.000.000,00',
        'Rp 870.000.000,00'
      );
      await (await homePage.form.getLastPageButton()).click();

      await homePage.form.validateAmortizationScheduleTableRow(
        119,
        '20/12/2033',
        'Rp 27.000.000,00',
        'Rp 15.000.000,00',
        'Rp 12.000.000,00',
        'Rp 30.000.000,00',
        'Rp 15.000.000,00'
      );
    });

    test('has correct table result with multiple flat interest periods', async ({
      homePage,
    }) => {
      await (
        await homePage.form.getPrincipalInputField()
      ).fill(`${1_800_000_000}`);

      await (await homePage.form.getInterestInputField()).fill('8');
      await (await homePage.form.getPeriodInputField()).fill('10');

      await (await homePage.form.getAddInterestPeriodButton()).click();
      await (await homePage.form.getInterestInputField(1)).fill('10.5');
      await (await homePage.form.getPeriodInputField(1)).fill('5');

      await (await homePage.form.getAddInterestPeriodButton()).click();
      await (await homePage.form.getInterestInputField(2)).fill('12.3');
      await (await homePage.form.getPeriodInputField(2)).fill('3');

      await (await homePage.form.getStartDateInputField()).fill('2023-05-10');
      await (await homePage.form.getCalculateButton()).click();

      await homePage.form.validateCalculationSummary(
        'Rp 1.800.000.000,00',
        'Rp 1.832.000.000,00',
        'Rp 3.632.000.000,00'
      );

      await homePage.form.validateAmortizationScheduleTableRow(
        1,
        '10/05/2023',
        'Rp 20.333.333,33',
        'Rp 8.333.333,33',
        'Rp 12.000.000,00',
        'Rp 1.800.000.000,00',
        'Rp 1.791.666.666,67'
      );
      await (await homePage.form.getNextPageButton()).click();

      await homePage.form.validateAmortizationScheduleTableRow(
        54,
        '10/10/2027',
        'Rp 20.333.333,33',
        'Rp 8.333.333,33',
        'Rp 12.000.000,00',
        'Rp 1.358.333.333,33',
        'Rp 1.350.000.000,00'
      );
      await (await homePage.form.getLastPageButton()).click();

      await homePage.form.validateAmortizationScheduleTableRow(
        213,
        '10/01/2041',
        'Rp 10.333.333,33',
        'Rp 8.333.333,33',
        'Rp 2.000.000,00',
        'Rp 33.333.333,33',
        'Rp 25.000.000,00'
      );
    });
  });
});

import { ErrorMessage } from '@kprfordummies/constants/error-messages';
import { test as base } from '@playwright/test';
import { HomePage } from '../pom/home-page';

const test = base.extend<{ homePage: HomePage }>({
  homePage: async ({ page }, use) => {
    const homePage = HomePage.factory(page);
    await homePage.nav.gotoWebsite();
    await homePage.nav.gotoAnnuityInterestForm();
    await use(homePage);
  },
});

test.describe('Annuity Interest Calculator', async () => {
  test('has correct initial form interface', async ({ homePage }) => {
    await homePage.hasValidTitle();
    await homePage.nav.hasValidNavsForAnnuityInterestForm();
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

    test('has form reset if reset button is clicked', async ({ homePage }) => {
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
    test('has correct table result with a single interest period', async ({
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
        'Rp 820.676.038,08',
        'Rp 2.620.676.038,08'
      );

      await homePage.form.validateAmortizationScheduleTableRow(
        11,
        '20/12/2024',
        'Rp 21.838.966,98',
        'Rp 10.514.929,99',
        'Rp 11.324.036,99',
        'Rp 1.698.605.548,45',
        'Rp 1.688.090.618,45'
      );
      await (await homePage.form.getNextPageButton()).click();

      await homePage.form.validateAmortizationScheduleTableRow(
        68,
        '20/09/2029',
        'Rp 21.838.966,98',
        'Rp 15.356.442,40',
        'Rp 6.482.524,58',
        'Rp 972.378.687,39',
        'Rp 957.022.244,99'
      );
      await (await homePage.form.getLastPageButton()).click();

      await homePage.form.validateAmortizationScheduleTableRow(
        111,
        '20/04/2033',
        'Rp 21.838.966,98',
        'Rp 20.435.026,69',
        'Rp 1.403.940,29',
        'Rp 210.591.043,50',
        'Rp 190.156.016,80'
      );
    });

    test('has correct table result with multiple interest periods', async ({
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
        'Rp 1.757.544.332,58',
        'Rp 3.557.544.332,58'
      );

      await homePage.form.validateAmortizationScheduleTableRow(
        7,
        '10/11/2023',
        'Rp 15.749.327,24',
        'Rp 3.901.822,22',
        'Rp 11.847.505,03',
        'Rp 1.777.125.754,36',
        'Rp 1.773.223.932,15'
      );
      await (await homePage.form.getNextPageButton()).click();

      await homePage.form.validateAmortizationScheduleTableRow(
        53,
        '10/09/2027',
        'Rp 15.749.327,24',
        'Rp 5.296.745,86',
        'Rp 10.452.581,38',
        'Rp 1.567.887.207,27',
        'Rp 1.562.590.461,41'
      );
      await (await homePage.form.getLastPageButton()).click();

      await homePage.form.validateAmortizationScheduleTableRow(
        195,
        '10/07/2039',
        'Rp 17.654.013,52',
        'Rp 14.106.151,84',
        'Rp 3.547.861,68',
        'Rp 346.132.846,92',
        'Rp 332.026.695,07'
      );
    });
  });
});

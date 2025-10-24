import { FormulaUtils } from '@/app/_utils';
import DownloadPDFButton from '@/app/components/pdf/DownloadPDFButton';
import {
  CurrentFormDataContext,
  CurrentInterestTypeContext,
} from '@/app/context';
import { PaymentDetails } from '@/types/formula';
import { InterestType } from '@/types/interest';
import { memo, useContext, useMemo } from 'react';
import AmortizationScheduleSummary from './AmortizationScheduleSummary';
import AmortizationScheduleTable from './AmortizationScheduleTable';

function AmortizationSchedule() {
  const { currentInterestType } = useContext(CurrentInterestTypeContext);
  const { currentFormData } = useContext(CurrentFormDataContext);

  const paymentDetails: PaymentDetails | undefined = useMemo(() => {
    if (InterestType.NONE != currentInterestType && !!currentFormData) {
      return FormulaUtils.generateAmortizationTable(
        currentFormData,
        currentInterestType
      );
    }
  }, [currentFormData, currentInterestType]);

  return (
    paymentDetails && (
      <div className="my-5">
        <h1 className="text-center text-xl font-bold mb-3">
          Jadwal Amortisasi
        </h1>
        {paymentDetails && (
          <>
            <AmortizationScheduleSummary paymentDetails={paymentDetails} />
            <DownloadPDFButton paymentDetails={paymentDetails} />
            <AmortizationScheduleTable paymentDetails={paymentDetails} />
          </>
        )}
      </div>
    )
  );
}

export default memo(AmortizationSchedule);

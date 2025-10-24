import { CurrencyUtils } from '@/app/_utils';
import { PaymentDetails } from '@/types/formula';
import { memo } from 'react';

interface Props {
  paymentDetails: PaymentDetails;
}

function AmortizationScheduleSummary({ paymentDetails }: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 max-w-md mb-3">
      <div>Pokok Pinjaman:</div>
      <div className="font-bold">
        {CurrencyUtils.format(paymentDetails.totalPrincipal)}
      </div>
      <div>Total Bunga yang dibayarkan:</div>
      <div className="font-bold">
        {CurrencyUtils.format(paymentDetails.totalPaidInterest)}
      </div>
      <div>Total Keseluruhan:</div>
      <div className="font-bold">
        {CurrencyUtils.format(paymentDetails.totalPaid)}
      </div>
    </div>
  );
}

export default memo(AmortizationScheduleSummary);

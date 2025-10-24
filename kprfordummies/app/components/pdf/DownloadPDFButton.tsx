import { PaymentDetails } from '@/types/formula';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { memo } from 'react';
import PDFDocument from './PDFDocument';

interface Props {
  paymentDetails: PaymentDetails;
}

function DownloadPDFButton({ paymentDetails }: Props) {
  return (
    <button className="mb-3 max-sm:w-full">
      <PDFDownloadLink
        document={<PDFDocument paymentDetails={paymentDetails} />}
        fileName={`jadwal_amortisasi_${Date.now()}.pdf`}
      >
        {({ loading }) => (loading ? 'Memuat dokumen...' : 'Unduh PDF')}
      </PDFDownloadLink>
    </button>
  );
}

export default memo(DownloadPDFButton);

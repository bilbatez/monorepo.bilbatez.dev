import { CurrencyUtils, DateUtils } from '@/app/_utils/';
import { PaymentDetails } from '@/types/formula';
import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

interface Props {
  paymentDetails: PaymentDetails;
}

function PDFDocument({ paymentDetails }: Props) {
  Font.register({
    family: 'Spectral',
    fonts: [
      {
        src: '/fonts/Spectral-Regular.ttf',
        fontStyle: 'normal',
        fontWeight: 'normal',
      },
      {
        src: '/fonts/Spectral-Bold.ttf',
        fontStyle: 'normal',
        fontWeight: 'bold',
      },
    ],
  });

  const styles = StyleSheet.create({
    title: {
      fontSize: 20,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    page: {
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Spectral',
      fontSize: 10,
      padding: 30,
    },
    section: {
      marginBottom: 5,
      flexGrow: 0,
    },
    row: {
      borderBottom: '1px solid #000',
      flexDirection: 'row',
      paddingTop: 2,
      paddingBottom: 2,
      fontSize: 8,
      textAlign: 'center',
    },
    col: {
      period: { width: '4%' },
      date: { width: '9%' },
      payment: { width: '17%' },
      repayment: { width: '17%' },
      interest: { width: '17%' },
      initialLoanBalance: { width: '18%' },
      finalLoanBalance: { width: '18%' },
    },
    bold: { fontWeight: 'bold' },
  });

  return (
    <Document creator="bilbatez.dev" producer="bilbatez.dev">
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Jadwal Amortisasi</Text>
        </View>
        <View style={styles.section}>
          <Text>
            Pokok Pinjaman:{' '}
            {CurrencyUtils.format(paymentDetails.totalPrincipal)}
          </Text>
          <Text>
            Total Bunga yang dibayarkan:{' '}
            {CurrencyUtils.format(paymentDetails.totalPaidInterest)}
          </Text>
          <Text>
            Total Keseluruhan: {CurrencyUtils.format(paymentDetails.totalPaid)}
          </Text>
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={[styles.col.period, styles.bold]}></Text>
            <Text style={[styles.col.date, styles.bold]}>Tanggal</Text>
            <Text style={[styles.col.payment, styles.bold]}>Pembayaran</Text>
            <Text style={[styles.col.repayment, styles.bold]}>
              Pelunasan Pokok
            </Text>
            <Text style={[styles.col.interest, styles.bold]}>Bunga</Text>
            <Text style={[styles.col.initialLoanBalance, styles.bold]}>
              Saldo Awal Pinjaman
            </Text>
            <Text style={[styles.col.finalLoanBalance, styles.bold]}>
              Saldo Akhir Pinjaman
            </Text>
          </View>
          {paymentDetails.paymentSchedules.map((row) => (
            <View
              key={row.period}
              style={[
                styles.row,
                {
                  backgroundColor: row.period % 2 === 0 ? '#f0f0f0' : '#ffffff',
                },
              ]}
            >
              <Text style={styles.col.period}>{row.period}</Text>
              <Text style={styles.col.date}>
                {DateUtils.displayFormat(row.date)}
              </Text>
              <Text style={styles.col.payment}>
                {CurrencyUtils.format(row.payment)}
              </Text>
              <Text style={styles.col.repayment}>
                {CurrencyUtils.format(row.repayment)}
              </Text>
              <Text style={styles.col.interest}>
                {CurrencyUtils.format(row.interest)}
              </Text>
              <Text style={styles.col.initialLoanBalance}>
                {CurrencyUtils.format(row.initialLoanBalance)}
              </Text>
              <Text style={styles.col.finalLoanBalance}>
                {CurrencyUtils.format(row.finalLoanBalance)}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text>
            Dokumen ini dibuat pada tanggal{' '}
            {DateUtils.displayFormat(new Date())}
          </Text>
          <Text>
            Dibuat di{' '}
            <Link src="https://kprfordummies.bilbatez.dev">Bilbatez.dev</Link>
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default PDFDocument;

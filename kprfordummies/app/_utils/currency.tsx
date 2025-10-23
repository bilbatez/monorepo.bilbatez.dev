export function format(value: number): string {
  return Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  })
    .format(value ? value : 0)
    .replace(/^Rp(?=\d)/, 'Rp '); // webkit has a different format without space, this normalize the format
}

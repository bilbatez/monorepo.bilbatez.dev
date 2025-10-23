export const ErrorMessage = {
  REQUIRED: 'Perlu diisi.',
  MINIMUM_NUMBER: (min: number) => `Nilai harus lebih besar dari ${min}.`,
  MAXIMUM_NUMBER: (max: number) => `Nilai harus lebih kecil dari ${max}.`,
  MUST_BE_NUMBER: 'Nilai harus angka.',
  MUST_BE_ROUND_NUMBER: 'Angka tidak boleh desimal.',
} as const;

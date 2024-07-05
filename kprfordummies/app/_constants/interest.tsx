import { AvailableInterest, InterestType } from "@/types/interest";

export const INTERESTS: AvailableInterest = {
    [InterestType.NONE]: {
        type: InterestType.NONE,
        display: {
            description: "Silahkan pilih Suku Bunga di atas!",
        },
    },
    [InterestType.FLAT]: {
        type: InterestType.FLAT,
        display: {
            name: "Suku Bunga Flat",
            description:
                "Suku bunga flat adalah jenis suku bunga yang digunakan dalam perhitungan pinjaman di mana bunga dihitung berdasarkan jumlah pinjaman awal tanpa memperhitungkan sisa saldo pinjaman yang tersisa. Artinya, besaran bunga yang harus dibayar setiap bulan tetap sama selama periode pinjaman, meskipun sisa saldo pinjaman berkurang setiap bulan.",
            formula: String.raw`\[\text{Bunga Per Bulan} = \text{Pokok Pinjaman} \times \text{Suku Bunga Per Tahun} \]`,
        },
    },
    [InterestType.EFFECTIVE]: {
        type: InterestType.EFFECTIVE,
        display: {
            name: "Suku Bunga Efektif",
            description:
                "Suku bunga efektif adalah suku bunga yang diperhitungkan dari sisa jumlah pokok pinjaman setiap bulan seiring dengan menyusutnya utang yang sudah dibayarkan. Artinya semakin sedikit pokok pinjaman, semakin sedikit juga suku bunga yang harus dibayarkan. Suku bunga efektif dianggap lebih adil bagi nasabah dibandingkan dengan menggunakan suku bunga flat. Pasalnya suku bunga flat hanya berdasarkan jumlah awal pokok pinjaman saja",
            formula: String.raw`\[\text{Bunga Per Bulan} = \text{Sisa Pokok Pinjaman Bulan Sebelumnya} \times \text{Suku Bunga Per Tahun} \times \frac{\text{Jumlah Hari Sebulan}}{\text{Jumlah Hari Dalam Setahun}} \]`,
        },
    },
    [InterestType.ANNUITY]: {
        type: InterestType.ANNUITY,
        display: {
            name: "Suku Bunga Anuitas",
            description:
                "Metode ini mengatur jumlah angsuran pokok ditambah angsuran bunga yang dibayar agar sama setiap bulan. Dalam perhitungan anuitas, porsi bunga pada masa awal sangat besar sedangkan porsi angsuran pokok sangat kecil. Mendekati berakhirnya masa kredit, keadaan akan menjadi berbalik. porsi angsuran pokok akan sangat besar sedangkan porsi bunga menjadi lebih kecil.",
            formula: ""
        },
    },
    [InterestType.FLOATING]: {
        type: InterestType.FLOATING,
        display: {
            name: "Suku Bunga Mengambang",
            description:
                "Suku bunga mengambang adalah suku bunga yang selalu berubah mengikuti suku bunga di pasaran. Jika suku bunga di pasaran naik, maka suku bunganya juga ikut naik, begitupun sebaliknya.",
        },
    }
}

'use client'

import { useState } from "react";

enum InterestType {
  NONE,
  FIXED,
  FLOATING,
  FLAT,
  EFFECTIVE,
  ANNUITY,
}

type Interest = {
  type: InterestType,
  display?: InterestDisplay,
}

type InterestDisplay = {
  name: string,
  description: string,
}

type InterestKey = keyof typeof INTEREST;

const INTEREST: { NONE: Interest, FIXED: Interest, FLOATING: Interest, FLAT: Interest, EFFECTIVE: Interest, ANNUITY: Interest } = {
  NONE: { type: InterestType.NONE },
  FIXED: {
    type: InterestType.FIXED,
    display: {
      name: 'Suku Bunga Tetap',
      description: 'Suku bunga tetap atau fixed adalah suku bunga yang bersifat tetap dan tidak berubah sampai jangka waktu atau sampai dengan tanggal jatuh tempo (selama jangka waktu kredit).',
    }
  },
  FLOATING: {
    type: InterestType.FLOATING,
    display: {
      name: 'Suku Bunga Mengambang',
      description: 'Suku bunga mengambang adalah suku bunga yang selalu berubah mengikuti suku bunga di pasaran. Jika suku bunga di pasaran naik, maka suku bunganya juga ikut naik, begitupun sebaliknya.'
    }
  },
  FLAT: {
    type: InterestType.FLAT,
    display: {
      name: 'Suku Bunga Flat',
      description: 'Suku bunga flat adalah suku bunga yang penghitungannya mengacu pada jumlah pokok pinjaman di awal untuk setiap periode cicilan. Penghitungannya sangat sederhana dibandingkan dengan suku bunga lainnya, sehingga umumnya digunakan untuk kredit jangka pendek untuk barang-barang konsumsi seperti handphone, peralatan rumah tangga, motor atau Kredit Tanpa Agunan (KTA).',
    }
  },
  EFFECTIVE: {
    type: InterestType.EFFECTIVE,
    display: {
      name: 'Suku Bunga Efektif',
      description: 'Suku bunga efektif adalah suku bunga yang diperhitungkan dari sisa jumlah pokok pinjaman setiap bulan seiring dengan menyusutnya utang yang sudah dibayarkan. Artinya semakin sedikit pokok pinjaman, semakin sedikit juga suku bunga yang harus dibayarkan. Suku bunga efektif dianggap lebih adil bagi nasabah dibandingkan dengan menggunakan suku bunga flat. Pasalnya suku bunga flat hanya berdasarkan jumlah awal pokok pinjaman saja',
    }
  },
  ANNUITY: {
    type: InterestType.ANNUITY,
    display: {
      name: 'Suku Bunga Anuitas',
      description: 'Metode ini mengatur jumlah angsuran pokok ditambah angsuran bunga yang dibayar agar sama setiap bulan. Dalam perhitungan anuitas, porsi bunga pada masa awal sangat besar sedangkan porsi angsuran pokok sangat kecil. Mendekati berakhirnya masa kredit, keadaan akan menjadi berbalik. porsi angsuran pokok akan sangat besar sedangkan porsi bunga menjadi lebih kecil.',
    }
  },
} as const

export default function Home() {

  const [activeType, setActiveType] = useState(InterestType.NONE)

  function InterestButtonsComponent() {
    function handleClick(type: InterestType) {
      setActiveType(type)
    }

    return (
      <div className="flex-wrap mt-3 mb-4">
        {Object.values(INTEREST).map((interest: Interest) => {
          if (interest.display) {
            return (
              <button
                key={interest.type}
                onClick={() => handleClick(interest.type)}
                disabled={interest.type == activeType ? true : false}
                className="mt-1"
              >
                {interest.display.name}
              </button>
            )
          }
        })}
      </div>
    )
  }

  function InterestDescriptionComponent() {
    if (activeType != InterestType.NONE) {
      const key: InterestKey = InterestType[activeType] as InterestKey
      return (
        <div>
          {INTEREST[key]?.display?.description}
        </div>
      )
    }
  }


  function InterestDetailsComponent() {
    return (
      <>
        <InterestDescriptionComponent />
      </>
    )
  }

  return (
    <main>
      <InterestButtonsComponent />
      <InterestDetailsComponent />
    </main>
  );
}

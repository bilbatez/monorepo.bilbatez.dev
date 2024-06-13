import { InterestType } from "@/types/interest";
import { memo } from "react";

function InterestFormula({
    activeType
}: {
    activeType: InterestType
}) {

    function getFormula() {
        switch (activeType) {
            case InterestType.NONE:
                return <></>
            case InterestType.FIXED:
                return <div>
                    <Math xmlns="http://www.w3.org/1998/Math/MathML">
                        <mrow>
                            <mi>Cicilan Bunga Per Bulan</mi>
                            <mo>=</mo>
                            <mrow>
                                <mfrac>
                                    <mrow>
                                        <mi>Pokok Pinjaman</mi>
                                        <mo>*</mo>
                                        <mi>Bunga Per Tahun</mi>
                                        <mo>*</mo>
                                        <mi>Tenor Pinjaman</mi>
                                    </mrow>
                                    <mrow>
                                        <mi>Tenor Pinjaman</mi>
                                        <mn>*</mn>
                                        <mn>12</mn>
                                    </mrow>
                                </mfrac>
                            </mrow>
                        </mrow>
                    </math>
                </div>
            case InterestType.FLOATING:
                return <div></div>
            case InterestType.FLAT:
                return <div></div>
            case InterestType.EFFECTIVE:
                return <div></div>
            case InterestType.ANNUITY:
                return <div></div>
        }
    }

    return (
        <>
            {getFormula()}
        </>
    )
}

export default memo(InterestFormula)
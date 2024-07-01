import { CurrentInterestType } from "@/types/context";
import { InterestType } from "@/types/interest";
import { memo, useContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { CurrentInterestTypeContext } from "../../context";
import NumberInputField from "./NumberInputField";

function InterestPeriodField() {

    const MIN_FIELD = 1
    const MAX_FIELD = 5

    const { currentInterestType }: CurrentInterestType = useContext(CurrentInterestTypeContext)
    const [currentNumberOfField, setCurrentNumberOfField] = useState(MIN_FIELD)

    useEffect(() => {
        setCurrentNumberOfField(() => MIN_FIELD)
    }, [currentInterestType])

    function hasMultipleInterestPeriod(): boolean {
        return new Set<InterestType>([
            InterestType.EFFECTIVE,
            InterestType.FLOATING
        ]).has(currentInterestType)
    }

    function hasDeletableField(): boolean {
        return currentNumberOfField > 1
    }

    function isMinimumNumberOfField(): boolean {
        return currentNumberOfField == MIN_FIELD
    }

    function isMaximumNumberOfField(): boolean {
        return currentNumberOfField == MAX_FIELD
    }

    function handleClickAdd(): void {
        setCurrentNumberOfField(() => currentNumberOfField + 1)
    }

    function handleClickDelete(): void {
        setCurrentNumberOfField(() => currentNumberOfField - 1)
    }

    function getFields() {
        const result = new Array(currentNumberOfField)
        for (let index = 0; index < currentNumberOfField; index++) {
            result[index] = (
                <div className="sm:flex" key={'interestperiod_' + index}>
                    <NumberInputField id={`interest[${index}]`} label="Suku Bunga (%)" min={0} max={20} width="w-full sm:w-1/2" placeholder="5" />
                    <NumberInputField id={`period[${index}]`} label="Lama Pinjaman (Dalam Tahun)" min={1} max={30} width="w-full sm:w-1/2" placeholder="15" containerClassName="sm:ml-1" roundNumber={true} />
                </div>
            )
        }
        return result
    }

    return (
        <>
            {getFields()}
            <div className={twMerge(
                "flex mb-5",
                !hasMultipleInterestPeriod() && "hidden"
            )}>
                <button type="button" onClick={handleClickDelete} className={twMerge(
                    "btn-sd",
                    isMaximumNumberOfField() ? 'w-full' : 'w-1/2',
                    !hasDeletableField() && 'hidden'
                )}>Hapus Suku Bunga</button>
                <button type="button" onClick={handleClickAdd} className={twMerge(
                    "btn-sd",
                    isMinimumNumberOfField() ? 'w-full' : 'w-1/2',
                    (!hasMultipleInterestPeriod() || isMaximumNumberOfField()) && 'hidden'
                )}>Tambah Suku Bunga</button>
            </div>
        </>
    )
}

export default memo(InterestPeriodField)
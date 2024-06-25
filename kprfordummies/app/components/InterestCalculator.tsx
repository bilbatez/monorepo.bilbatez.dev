import { memo } from "react";
import clsx from "clsx/lite";
import NumberInputField from "./NumberInputField";
import DateInputField from "./DateInputField";

function InterestCalculator({
    className,
    hidden = false,
}: {
    className?: string,
    hidden?: boolean,
}) {
    return (
        <div className="max-w-lg mx-auto">
            <form className={clsx(hidden && "hidden", className)}>
                <NumberInputField id="principal" label="Pokok Pinjaman (Rp.)" placeholder="100000000" />
                <div className="flex">
                    <NumberInputField id="interest" label="Suku Bunga (%)" min={0} max={20} width="w-1/2" placeholder="5" />
                    <NumberInputField id="period" label="Lama Pinjaman (Dalam Tahun)" min={1} max={30} width="w-1/2" placeholder="15" containerClassName="ml-1" />
                </div>
                <DateInputField id="startDate" label="Tanggal Mulai" placeholder="30/07/2015" />
                <div className="flex">
                    <button type="reset" className="w-1/2">Ulangi</button>
                    <button type="submit" className="w-1/2 btn-sb">Kalkulasi</button>
                </div>
            </form>
        </div>
    )
}

export default memo(InterestCalculator)
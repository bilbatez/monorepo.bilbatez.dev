import { HTMLAttributes, memo } from "react";
import clsx from "clsx/lite";
import NumberInputField from "./NumberInputField";
import DateInputField from "./DateInputField";
import InterestPeriodField from "./InterestPeriodField";
import { FieldValues, FormProvider, useForm } from "react-hook-form";

interface Props {
    className?: string,
    hidden?: boolean,
}

function InterestCalculator({
    className,
    hidden = false,
}: Props) {

    const methods = useForm()

    function submit(data: FieldValues) {
        console.log(data)
    }

    function handleReset() {
        methods.reset()
    }

    return (
        <div className="max-w-lg mx-auto">
            <FormProvider {...methods}>
                <form className={clsx(hidden && "hidden", className)} onSubmit={methods.handleSubmit(submit)}>
                    <NumberInputField id="principal" label="Pokok Pinjaman (Rp.)" placeholder="100000000" />
                    <InterestPeriodField />
                    <DateInputField id="startDate" label="Tanggal Mulai" placeholder="30/07/2015" />
                    <div className="flex">
                        <button type="reset" onClick={handleReset} className="w-1/2 btn-sd">Ulangi</button>
                        <button type="submit" className="w-1/2 btn-sb">Kalkulasi</button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export default memo(InterestCalculator)
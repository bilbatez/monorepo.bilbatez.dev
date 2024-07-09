import { ErrorMessage } from "@hookform/error-message"
import { memo } from "react"
import { RegisterOptions, useFormContext } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { ErrorMessage as em } from "../../_constants/error-messages"

interface DisplayInputValueProps {
    displayInputValue: boolean,
    inputValueFormatter: (s: string) => string,
}

interface DisplayInputValueRefProps {
    displayInputValue?: undefined,
    inputValueFormatter?: never,
}

interface MainProps {
    id: string,
    label: string,
    min?: number,
    max?: number,
    width?: string,
    containerClassName?: string,
    inputClassName?: string,
    hidden?: boolean,
    placeholder?: string,
    roundNumber?: boolean,
}

type Props = MainProps & (DisplayInputValueProps | DisplayInputValueRefProps)

function NumberInputField({
    id,
    label,
    min,
    max,
    width,
    containerClassName,
    inputClassName,
    hidden = false,
    placeholder,
    roundNumber,
    displayInputValue,
    inputValueFormatter,
}: Props) {

    const {
        register,
        trigger,
        getValues,
        formState: { errors },
    } = useFormContext()

    const options: RegisterOptions = {
        required: em.REQUIRED,
        min: {
            value: min ?? 0,
            message: em.MINIMUM_NUMBER(min ?? 0)
        },
        onChange: () => trigger(id)

    }

    if (max) {
        options.max = {
            value: max,
            message: em.MAXIMUM_NUMBER(max)
        }
    }

    const isRoundNumber: boolean = roundNumber ?? false

    if (isRoundNumber) {
        options.validate = {
            validateIsNumber: (num) => !isNaN(num) || em.MUST_BE_NUMBER,
            validateRoundNumber: (num) => num % 1 === 0 || em.MUST_BE_ROUND_NUMBER,
        }
    }

    function displayInputFormatterValue() {
        if (displayInputValue) {
            return (
                <span key={`display_${id}`}>{inputValueFormatter(getValues(id))}</span>
            )
        }
    }

    return (
        <>
            <div className={twMerge("mb-2", width, containerClassName)}>
                <label htmlFor={id}>{label} {displayInputFormatterValue()}</label>
                <input className={twMerge(
                    "std-in",
                    inputClassName,
                    errors?.[id] && "has-error",
                    hidden && "hidden",
                )}
                    placeholder={placeholder}
                    {...register(id, options)}
                />
                <div className="error-message">
                    <ErrorMessage name={id} errors={errors} />
                </div>
            </div>
        </>
    )
}

export default memo(NumberInputField)

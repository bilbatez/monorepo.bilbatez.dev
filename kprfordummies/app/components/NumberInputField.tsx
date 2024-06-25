import { memo } from "react"
import clsx from "clsx/lite"

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
}: {
    id: string,
    label: string,
    min?: number,
    max?: number,
    width?: string,
    containerClassName?: string,
    inputClassName?: string,
    hidden?: boolean,
    placeholder?: string,
}) {
    return (
        <>
            <div className={clsx("mb-5", width, containerClassName)}>
                <label htmlFor={id}>{label}</label>
                <input type="number"
                    id={label}
                    name={id}
                    className={clsx("std-in", hidden && "hidden", inputClassName)}
                    min={min}
                    max={max}
                    placeholder={placeholder}
                    required />
            </div>
        </>
    )
}

export default memo(NumberInputField)

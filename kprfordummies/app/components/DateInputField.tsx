import clsx from "clsx";
import { memo } from "react";

function DateInputField({
    id,
    label,
    placeholder,
    inputClassName,
}: {
    id: string,
    label: string,
    placeholder?: string,
    inputClassName?: string,
}) {
    return (
        <div className="mb-5">
            <label htmlFor={id}>{label}</label>
            <input type="date" id={id} name={id} placeholder={placeholder} className={clsx("std-in", inputClassName)} required />
        </div>
    )
}

export default memo(DateInputField)
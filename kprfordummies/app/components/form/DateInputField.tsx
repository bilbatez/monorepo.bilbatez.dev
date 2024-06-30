import clsx from "clsx";
import { memo } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import { ErrorMessage as em } from "../../_constants/error-messages";
import { ErrorMessage } from "@hookform/error-message";

interface Props {
    id: string,
    label: string,
    placeholder?: string,
    inputClassName?: string,
}

function DateInputField({
    id,
    label,
    placeholder,
    inputClassName,
}: Props) {

    const {
        register,
        trigger,
        formState: { errors },
    } = useFormContext()

    const options: RegisterOptions = {
        required: em.REQUIRED,
        onChange: () => trigger(id)
    }

    return (
        <div className="mb-5">
            <label htmlFor={id}>{label}</label>
            <input type="date"
                placeholder={placeholder}
                className={clsx("std-in", inputClassName)}
                {...register(id, options)}
            />

            <div className="error-message">
                <ErrorMessage name={id} errors={errors} />
            </div>
        </div>
    )
}

export default memo(DateInputField)
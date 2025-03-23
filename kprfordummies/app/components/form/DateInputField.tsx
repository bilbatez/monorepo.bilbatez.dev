import { ErrorMessage as em } from "@/app/_constants/error-messages";
import { ErrorMessage } from "@hookform/error-message";
import { memo } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface Props {
  id: string;
  label: string;
  placeholder?: string;
  inputClassName?: string;
}

function DateInputField({ id, label, placeholder, inputClassName }: Props) {
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext();

  const options: RegisterOptions = {
    required: em.REQUIRED,
    valueAsDate: true,
    onChange: () => trigger(id),
  };

  return (
    <div className="mb-3">
      <label htmlFor={id}>
        {label}
        <input
          type="date"
          placeholder={placeholder}
          className={twMerge("std-in", inputClassName)}
          {...register(id, options)}
        />
      </label>

      <div className="error-message">
        <ErrorMessage name={id} errors={errors} />
      </div>
    </div>
  );
}

export default memo(DateInputField);

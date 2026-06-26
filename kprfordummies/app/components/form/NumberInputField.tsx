import { ErrorMessage as em } from '@/app/_constants/error-messages';
import { memo } from 'react';
import { RegisterOptions, useFormContext, useFormState } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface DisplayInputValueProps {
  displayInputValue: boolean;
  inputValueFormatter: (s: string) => string;
}

interface DisplayInputValueRefProps {
  displayInputValue?: undefined;
  inputValueFormatter?: never;
}

interface MainProps {
  id: string;
  label: string;
  min?: number;
  max?: number;
  width?: string;
  containerClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  roundNumber?: boolean;
}

type Props = MainProps & (DisplayInputValueProps | DisplayInputValueRefProps);

function NumberInputField({
  id,
  label,
  min,
  max,
  width,
  containerClassName,
  inputClassName,
  placeholder,
  roundNumber,
  displayInputValue,
  inputValueFormatter,
}: Props) {
  const { register, trigger, getValues, control, getFieldState } =
    useFormContext();
  const formState = useFormState({ control, name: id });
  const fieldError = getFieldState(id, formState).error;

  const options: RegisterOptions = {
    required: em.REQUIRED,
    min: {
      value: min ?? 0,
      message: em.MINIMUM_NUMBER(min ?? 0),
    },
    validate: {
      validateIsNumber: (num: number) => !isNaN(num) || em.MUST_BE_NUMBER,
    },
    valueAsNumber: true,
    onChange: () => trigger(id),
  };

  if (max) {
    options.max = {
      value: max,
      message: em.MAXIMUM_NUMBER(max),
    };
  }

  if (roundNumber ?? false) {
    options.validate = {
      ...options.validate,
      validateRoundNumber: (num: number) =>
        num % 1 === 0 || em.MUST_BE_ROUND_NUMBER,
    };
  }

  function displayInputFormatterValue() {
    if (displayInputValue) {
      return (
        <span key={`display_${id}`}>{inputValueFormatter(getValues(id))}</span>
      );
    }
  }

  return (
    <>
      <div className={twMerge('mb-1', width, containerClassName)}>
        <label htmlFor={id}>
          <span className={twMerge('mb-1', ' block')}>
            {label} {displayInputFormatterValue()}
          </span>
          <input
            className={twMerge(
              'std-in',
              inputClassName,
              fieldError && 'has-error'
            )}
            placeholder={placeholder}
            {...register(id, options)}
          />

          <div className="error-message">{fieldError?.message?.toString()}</div>
        </label>
      </div>
    </>
  );
}

export default memo(NumberInputField);

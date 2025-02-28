import { CurrencyUtils, DateUtils } from "@/app/_utils";
import {
  CurrentFormDataContext,
  CurrentInterestTypeContext,
} from "@/app/context";
import { LoanRequest } from "@/types/formula";
import { memo, useContext } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import DateInputField from "./DateInputField";
import InterestPeriodField from "./InterestPeriodField";
import NumberInputField from "./NumberInputField";

interface Props {
  className?: string;
}

function InterestCalculator({ className }: Props) {
  const { currentInterestType } = useContext(CurrentInterestTypeContext);
  const { setCurrentFormData } = useContext(CurrentFormDataContext);

  const methods = useForm({
    defaultValues: {
      interestPeriod: [{}],
      startDate: DateUtils.htmlInputFormat(new Date()),
    },
  });

  function submit(data: FieldValues) {
    setCurrentFormData(new LoanRequest(data, currentInterestType));
  }

  function handleReset() {
    methods.reset();
  }

  return (
    <div className="max-w-lg mx-auto">
      <FormProvider {...methods}>
        <form
          className={twMerge(className)}
          onSubmit={methods.handleSubmit(submit)}
        >
          <NumberInputField
            id="principal"
            label="Pokok Pinjaman"
            placeholder="100000000"
            displayInputValue={true}
            inputValueFormatter={(val) =>
              `(${CurrencyUtils.format(parseFloat(val))})`
            }
          />
          <InterestPeriodField />
          <DateInputField
            id="startDate"
            label="Tanggal Mulai"
            placeholder="30/07/2015"
          />
          <div className="flex">
            <button type="reset" onClick={handleReset} className="w-1/2 btn-sd">
              Ulangi
            </button>
            <button type="submit" className="w-1/2 btn-sb">
              Kalkulasi
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default memo(InterestCalculator);

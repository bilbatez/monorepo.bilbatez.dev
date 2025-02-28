import { memo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import NumberInputField from "./NumberInputField";

function InterestPeriodField() {
  const MIN_FIELD = 1;
  const MAX_FIELD = 5;

  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "interestPeriod",
  });

  const currentNumberOfField = fields.length;

  function hasDeletableField(): boolean {
    return currentNumberOfField > 1;
  }

  function isMinimumNumberOfField(): boolean {
    return currentNumberOfField == MIN_FIELD;
  }

  function isMaximumNumberOfField(): boolean {
    return currentNumberOfField == MAX_FIELD;
  }

  function handleClickAdd(): void {
    append({ interest: null, period: null });
  }

  function handleClickDelete(): void {
    remove(currentNumberOfField - 1);
  }

  function getFields() {
    return fields.map((field, index) => (
      <div className="sm:flex" key={field.id}>
        <NumberInputField
          id={`interestPeriod.${index}].interest`}
          label="Suku Bunga (%)"
          min={0}
          max={30}
          width="w-full sm:w-1/2"
          placeholder="5"
        />
        <NumberInputField
          id={`interestPeriod.${index}].period`}
          label="Lama Pinjaman (Dalam Tahun)"
          min={1}
          max={150}
          width="w-full sm:w-1/2"
          placeholder="15"
          containerClassName="sm:ml-1"
          roundNumber={true}
        />
      </div>
    ));
  }

  return (
    <>
      {getFields()}
      <div className={twMerge("flex mb-5")}>
        {hasDeletableField() && (
          <button
            type="button"
            onClick={handleClickDelete}
            className={twMerge(
              "btn-sd",
              isMaximumNumberOfField() ? "w-full" : "w-1/2",
            )}
          >
            Hapus Suku Bunga
          </button>
        )}
        {!isMaximumNumberOfField() && (
          <button
            type="button"
            onClick={handleClickAdd}
            className={twMerge(
              "btn-sd",
              isMinimumNumberOfField() ? "w-full" : "w-1/2",
            )}
          >
            Tambah Suku Bunga
          </button>
        )}
      </div>
    </>
  );
}

export default memo(InterestPeriodField);

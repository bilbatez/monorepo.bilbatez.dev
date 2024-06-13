import { MouseEventHandler, memo } from "react"
import { Interest } from "@/types/interest"

function InterestButton({
  interest,
  disabled,
  onClick,
}: {
  interest: Interest,
  disabled: boolean,
  onClick: MouseEventHandler<HTMLButtonElement>,
}) {
  return (
    <button
      key={interest.type}
      onClick={onClick}
      disabled={disabled}
      className="mt-1"
    >
      {interest.display?.name}
    </button>
  )
}

export default memo(InterestButton)
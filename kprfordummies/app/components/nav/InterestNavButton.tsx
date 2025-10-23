import { Interest } from '@/types/interest';
import { MouseEventHandler, memo } from 'react';

interface Props {
  interest: Interest;
  disabled: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

function InterestButton({ interest, disabled, onClick }: Props) {
  return (
    <button
      key={interest.type}
      onClick={onClick}
      disabled={disabled}
      className="mt-1 max-sm:w-full"
    >
      {interest.display?.name}
    </button>
  );
}

export default memo(InterestButton);

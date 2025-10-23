import { INTERESTS } from '@/app/_constants/interest';
import { CurrentInterestTypeContext } from '@/app/context';
import { CurrentInterestType } from '@/types/context';
import { memo, useContext } from 'react';
import InterestFormula from './InterestFormula';

function InterestDescription() {
  const { currentInterestType }: CurrentInterestType = useContext(
    CurrentInterestTypeContext
  );

  const description = INTERESTS[currentInterestType].display?.description;
  const formula = INTERESTS[currentInterestType].display?.formula;

  return (
    <div className="mb-5">
      <span className="block mb-3">{description}</span>
      {formula && <InterestFormula formula={formula} />}
    </div>
  );
}

export default memo(InterestDescription);

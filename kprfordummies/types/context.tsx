import { Dispatch, SetStateAction } from 'react';
import { InterestType } from './interest';
import { LoanRequest } from './formula';

export class CurrentInterestType {
  currentInterestType!: InterestType;
  setCurrentInterestType!: Dispatch<SetStateAction<InterestType>>;
}

export class CurrentFormData {
  currentFormData?: LoanRequest;
  setCurrentFormData!: Dispatch<SetStateAction<LoanRequest | undefined>>;
}

import { Dispatch, SetStateAction } from "react";
import { InterestType } from "./interest";

export class CurrentInterestType {
    currentInterestType!: InterestType
    setCurrentInterestType!: Dispatch<SetStateAction<InterestType>>
}
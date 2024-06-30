import { memo, useContext } from "react";
import { Interest, InterestType } from "@/types/interest";
import InterestButton from "./InterestNavButton";
import { CurrentInterestTypeContext } from "../../context";
import { CurrentInterestType } from "@/types/context";
import { INTERESTS } from "../../_constants/interest";


function InterestNav() {

    const {
        currentInterestType,
        setCurrentInterestType
    }: CurrentInterestType = useContext(CurrentInterestTypeContext)

    function handleClick(interestType: InterestType) {
        setCurrentInterestType(interestType)
    }

    return (
        <div className="flex-wrap mt-3 mb-4">
            {Object.values(INTERESTS).map((interest: Interest) => {
                if (interest.display.name) {
                    return (
                        <InterestButton
                            key={interest.type}
                            interest={interest}
                            disabled={currentInterestType === interest.type}
                            onClick={() => handleClick(interest.type)}
                        />
                    )
                }
            })}
        </div>
    )
}

export default memo(InterestNav)
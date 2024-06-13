import { Dispatch, SetStateAction, memo } from "react";
import { INTERESTS, Interest, InterestType } from "@/types/interest";
import InterestButton from "./InterestButton";


function InterestNav({
    activeType,
    setActiveType
}: {
    activeType: InterestType,
    setActiveType: Dispatch<SetStateAction<InterestType>>
}) {

    function handleClick(interestType: InterestType) {
        setActiveType(interestType)
    }

    return (
        <div className="flex-wrap mt-3 mb-4">
            {Object.values(INTERESTS).map((interest: Interest) => {
                if (interest.display.name) {
                    return (
                        <InterestButton
                            key={interest.type}
                            interest={interest}
                            disabled={activeType === interest.type}
                            onClick={() => handleClick(interest.type)}
                        />
                    )
                }
            })}
        </div>
    )
}

export default memo(InterestNav)
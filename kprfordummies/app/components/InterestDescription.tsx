import { INTERESTS, InterestType, InterestKey } from "@/types/interest"
import { memo } from "react"

function InterestDescription({
    activeType,
}: {
    activeType: InterestType
}) {

    const key: InterestKey = InterestType[activeType] as InterestKey

    return (
        <div>
            {INTERESTS[key].display?.description}
        </div>
    )
}

export default memo(InterestDescription)
'use client'

import { memo, useState } from "react";
import InterestNav from "./components/InterestNav";
import InterestDescription from "./components/InterestDescription";
import { InterestType } from "@/types/interest";
import { CurrentInterestTypeContext } from "./context";
import { MathJaxContext } from "better-react-mathjax";
import InterestCalculator from "./components/InterestCalculator";

function Home() {

  const [currentInterestType, setCurrentInterestType] = useState<InterestType>(InterestType.NONE)

  return (
    <MathJaxContext>
      <CurrentInterestTypeContext.Provider value={{
        currentInterestType,
        setCurrentInterestType,
      }}>
        <main>
          <InterestNav />
          <InterestDescription />
          <InterestCalculator hidden={currentInterestType == InterestType.NONE} />
        </main>
      </CurrentInterestTypeContext.Provider>
    </MathJaxContext>
  );
}

export default memo(Home)

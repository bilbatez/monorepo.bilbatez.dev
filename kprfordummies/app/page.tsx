'use client'

import { memo, useState } from "react";
import InterestNav from "./components/InterestNav";
import InterestDescription from "./components/InterestDescription";
import { InterestType } from "@/types/interest";
import { CurrentInterestTypeContext } from "./context";
import { MathJaxContext } from "better-react-mathjax";
import InterestCalculator from "./components/InterestCalculator";
import Title from "./components/Title";
import Footer from "./components/Footer";

function Home() {

  const [currentInterestType, setCurrentInterestType] = useState<InterestType>(InterestType.NONE)

  return (
    <MathJaxContext>
      <CurrentInterestTypeContext.Provider value={{
        currentInterestType,
        setCurrentInterestType,
      }}>
        <Title />
        <main>
          <InterestNav />
          <InterestDescription />
          <InterestCalculator hidden={currentInterestType == InterestType.NONE} />
        </main>
        <Footer />
      </CurrentInterestTypeContext.Provider>
    </MathJaxContext>
  );
}

export default memo(Home)

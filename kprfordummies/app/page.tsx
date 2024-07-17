'use client'

import { LoanRequest } from "@/types/formula";
import { InterestType } from "@/types/interest";
import { MathJaxContext } from "better-react-mathjax";
import { memo, useState } from "react";
import AmortizationSchedule from "./components/amortization/AmortizationSchedule";
import Footer from "./components/Footer";
import InterestCalculator from "./components/form/InterestCalculator";
import InterestDescription from "./components/InterestDescription";
import InterestNav from "./components/nav/InterestNav";
import Title from "./components/Title";
import { CurrentFormDataContext, CurrentInterestTypeContext } from "./context";

function Home() {

  const [currentInterestType, setCurrentInterestType] = useState<InterestType>(InterestType.NONE)
  const [currentFormData, setCurrentFormData] = useState<LoanRequest>()

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
          <CurrentFormDataContext.Provider value={{
            currentFormData,
            setCurrentFormData,
          }}>
            <InterestCalculator hidden={currentInterestType == InterestType.NONE} />
            <AmortizationSchedule />
          </CurrentFormDataContext.Provider>
        </main>
        <Footer />
      </CurrentInterestTypeContext.Provider>
    </MathJaxContext>
  );
}

export default memo(Home)

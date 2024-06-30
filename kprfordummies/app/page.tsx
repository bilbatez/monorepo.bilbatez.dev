'use client'

import { memo, useState } from "react";
import InterestNav from "./components/nav/InterestNav";
import InterestDescription from "./components/InterestDescription";
import { InterestType } from "@/types/interest";
import { CurrentFormDataContext, CurrentInterestTypeContext } from "./context";
import { MathJaxContext } from "better-react-mathjax";
import InterestCalculator from "./components/form/InterestCalculator";
import Title from "./components/Title";
import Footer from "./components/Footer";
import { LoanRequest } from "@/types/formula";
import AmortizationSchedule from "./components/table/AmortizationSchedule";

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

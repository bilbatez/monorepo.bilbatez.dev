'use client';

import { LoanRequest } from '@/types/formula';
import { InterestType } from '@/types/interest';
import { MathJaxContext } from 'better-react-mathjax';
import { memo, useState } from 'react';
import Footer from './components/Footer';
import InterestDescription from './components/InterestDescription';
import Title from './components/Title';
import InterestCalculator from './components/form/InterestCalculator';
import InterestNav from './components/nav/InterestNav';
import AmortizationSchedule from './components/table/AmortizationSchedule';
import { CurrentFormDataContext, CurrentInterestTypeContext } from './context';

function Home() {
  const [currentInterestType, setCurrentInterestType] = useState<InterestType>(
    InterestType.NONE
  );
  const [currentFormData, setCurrentFormData] = useState<LoanRequest>();

  return (
    <MathJaxContext>
      <CurrentInterestTypeContext.Provider
        value={{
          currentInterestType,
          setCurrentInterestType,
        }}
      >
        <Title />
        <main>
          <InterestNav />
          <InterestDescription />
          <CurrentFormDataContext.Provider
            value={{
              currentFormData,
              setCurrentFormData,
            }}
          >
            {currentInterestType !== InterestType.NONE && (
              <InterestCalculator />
            )}
            <AmortizationSchedule />
          </CurrentFormDataContext.Provider>
        </main>
        <Footer />
      </CurrentInterestTypeContext.Provider>
    </MathJaxContext>
  );
}

export default memo(Home);

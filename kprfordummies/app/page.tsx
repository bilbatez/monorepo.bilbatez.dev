'use client'

import { useState } from "react";
import InterestNav from "./components/InterestNav";
import InterestDescription from "./components/InterestDescription";
import { InterestType } from "@/types/interest";


export default function Home() {

  const [activeType, setActiveType] = useState<InterestType>(InterestType.NONE)

  return (
    <MathJaxContext>
      <main>
        <InterestNav
          activeType={activeType}
          setActiveType={setActiveType}
        />
        <InterestDescription
          activeType={activeType}
        />
      </main>
    </MathJaxContext>
  );
}

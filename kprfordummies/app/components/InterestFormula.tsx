import { MathJax } from 'better-react-mathjax';
import { memo } from 'react';

interface Props {
  formula: string;
}

function InterestFormula({ formula }: Props) {
  return (
    <MathJax>
      <div className="relative overflow-x-auto overflow-y-hidden">
        {formula}
      </div>
    </MathJax>
  );
}

export default memo(InterestFormula);

import { CurrentInterestType } from '@/types/context';
import { InterestType } from '@/types/interest';
import { memo, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CurrentInterestTypeContext } from '../context';

function Title() {
  const { setCurrentInterestType }: CurrentInterestType = useContext(
    CurrentInterestTypeContext
  );

  function handleClick() {
    setCurrentInterestType(InterestType.NONE);
  }

  return (
    <div>
      <Link to="/" className="inline-flex items-center" onClick={handleClick}>
        <img
          src="/assets/house.svg"
          width={40}
          height={40}
          alt="house icon"
          className="mr-2"
        />
        <h1 className="text-2xl font-bold">Kalkulator KPR</h1>
      </Link>
    </div>
  );
}

export default memo(Title);

import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { useDimensions } from '../../hooks/useDimensions';

import './Peekaboo.scss';

interface PeekabooProps {
  className?: string;
  children: React.ReactNode;
}

function Peekaboo(props: PeekabooProps) {
  const { className, children } = props;

  const timer = useRef<number>();
  const prevPosition = useRef<number>(0);
  const [fixed, setFixed] = useState(false);
  const [dimRef, dimensions] = useDimensions<HTMLDivElement>();

  useEffect(() => {
    function handleHide() {
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollingUp = scrollY > prevPosition.current;

        if (scrollY === 0 && fixed) {
          setFixed(false);
        } else if (scrollingUp && !fixed) {
          setFixed(true);
        } else if (!scrollingUp && fixed) {
          setFixed(false);
        }

        prevPosition.current = scrollY;
      }, 250);
    }

    window.addEventListener('scroll', handleHide);
    return () => window.removeEventListener('scroll', handleHide);
  }, [fixed]);

  return (
    <div style={{ height: dimensions?.height }}>
      <div
        ref={dimRef}
        className={classNames(
          'peekaboo',
          { 'peekaboo--fixed': fixed },
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default Peekaboo;

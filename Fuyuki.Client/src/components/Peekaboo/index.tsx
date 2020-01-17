import classNames from 'classnames';
import React, { useState, useEffect, useRef } from 'react';

import { useDimensions } from '../../hooks/useDimensions';

import './Peekaboo.scss';

interface PeekabooProps {
  className?: string;
  children: React.ReactChildren;
}

function Peekaboo(props: PeekabooProps) {
  const { className, children } = props;

  const timer = useRef<number>();
  const prevPosition = useRef<number>(0);
  const [hidden, setHidden] = useState(false);
  const [dimRef, dimensions] = useDimensions<HTMLDivElement>();

  useEffect(() => {
    function handleHide() {
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollingUp = scrollY > prevPosition.current;

        if (scrollingUp && !hidden) {
          setHidden(true);
        } else if (scrollingUp && hidden) {
          setHidden(false);
        }

        prevPosition.current = scrollY;
      }, 500);
    }

    window.addEventListener('scroll', handleHide);
    return () => window.removeEventListener('scroll', handleHide);
  }, [hidden]);

  const height = hidden
    ? { height: 0, overflow: 'hidden' }
    : { height: dimensions?.height };

  return (
    <div style={height}>
      <div ref={dimRef} className={classNames('peekaboo', className)}>
        {children}
      </div>
    </div>
  );
}

export default Peekaboo;

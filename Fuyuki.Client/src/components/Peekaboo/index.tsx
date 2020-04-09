import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { Button } from 'meiko/Button';
import MkoIcons from 'meiko/constants/icons';
import { useDimensions } from '../../hooks/useDimensions';

import './Peekaboo.scss';

export const PeekabooContext = React.createContext('');

interface PeekabooProps {
  className?: string;
  children: React.ReactNode;
  threshold?: number;
}

function Peekaboo(props: PeekabooProps) {
  const { className, children, threshold = 0 } = props;

  const timer = useRef<number>();
  const prevPosition = useRef<number>(0);
  const [fixed, setFixed] = useState(false);

  const refreshKey = useContext(PeekabooContext);
  const [dimRef, dimensions] = useDimensions<HTMLDivElement>(refreshKey);
  const peekabooHeight = dimensions?.height ?? 0;

  useEffect(() => {
    function handleHide() {
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollingUp = scrollY < prevPosition.current;

        const scrollDiff = prevPosition.current - scrollY;
        const breaksThreshold = scrollDiff > threshold;

        const scrollIsZero = scrollY === 0;
        const ignorePeek = scrollY < peekabooHeight || scrollIsZero;

        if (ignorePeek && fixed) {
          setFixed(false);
        } else if (scrollingUp && !ignorePeek && !fixed && breaksThreshold) {
          setFixed(true);
        } else if (!scrollingUp && fixed) {
          setFixed(false);
        }

        if (!scrollingUp || breaksThreshold || scrollIsZero) {
          prevPosition.current = scrollY;
        }
      }, 100);
    }

    window.addEventListener('scroll', handleHide);
    return () => window.removeEventListener('scroll', handleHide);
  }, [fixed, peekabooHeight, threshold]);

  return (
    <div style={{ height: dimensions?.height || undefined }}>
      <div
        ref={dimRef}
        className={classNames(
          'peekaboo',
          { 'peekaboo--fixed': fixed },
          className
        )}
      >
        {children}
        <Button
          className={classNames('peekaboo__collapse', {
            'peekaboo__collapse--hide': !fixed
          })}
          aria-label="Collapse peekaboo"
          title="Collapse peekaboo"
          icon={MkoIcons.up}
          disabled={!fixed}
          onClick={() => setFixed(false)}
        />
      </div>
    </div>
  );
}

export default Peekaboo;

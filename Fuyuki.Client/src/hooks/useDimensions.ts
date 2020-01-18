import { useCallback, useLayoutEffect, useState } from 'react';

function addEvent(event: string, cb: EventListenerOrEventListenerObject) {
  window.addEventListener(event, cb);
  return () => window.removeEventListener(event, cb);
}

export function useDimensions<T extends HTMLElement>(): [
  (node: T) => void,
  DOMRect | null,
  T | null
] {
  const [node, setNode] = useState<T | null>(null);
  const [dimensions, setDimensions] = useState<DOMRect | null>(null);

  const ref = useCallback((element) => {
    setNode(element);
  }, []);

  useLayoutEffect(() => {
    function measure() {
      window.requestAnimationFrame(() =>
        node ? setDimensions(node.getBoundingClientRect()) : null
      );
    }

    if (node) {
      measure();

      const removeResize = addEvent('resize', measure);

      return () => {
        removeResize();
      };
    }
  }, [node]);

  return [ref, dimensions, node];
}

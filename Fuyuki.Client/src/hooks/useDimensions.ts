import { useCallback, useLayoutEffect, useRef, useState } from 'react';

function addEvent(event: string, cb: EventListenerOrEventListenerObject) {
  window.addEventListener(event, cb);
  return () => window.removeEventListener(event, cb);
}

export function useDimensions<T extends HTMLElement>(
  key?: string
): [(node: T) => void, DOMRect | null, T | null] {
  const timer = useRef<number>(0);
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

      const ob = new MutationObserver((mutations) => {
        const hasImage = mutations.some((x) =>
          Array.from(x.addedNodes).some(
            (y) => (y as HTMLElement).tagName === 'IMG'
          )
        );

        const change = mutations.some(
          (x) => x.addedNodes.length || x.removedNodes.length
        );

        if (change) {
          clearTimeout(timer.current);
          timer.current = window.setTimeout(
            () => measure(),
            hasImage ? 200 : 0
          );
        }
      });

      ob.observe(node, {
        childList: true,
        subtree: true
      });

      return () => {
        removeResize();
        ob.disconnect();
      };
    }
  }, [node, key]);

  return [ref, dimensions, node];
}

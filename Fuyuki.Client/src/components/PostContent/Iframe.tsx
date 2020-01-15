import React, { useState, useEffect, useRef } from 'react';

import { ContentProps } from './ContentProps';
import { ContentType } from 'src/utils/content/types/ContentType';

interface IframeSizes {
  [key: string]: any;
  height: number;
  width: number;
}

function ContentIframe({ data }: ContentProps) {
  const [iframeSizes, setIframeSizes] = useState<IframeSizes | undefined>();
  const iframeRef = useRef(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const { data } = event;
      if (event.origin === window.location.origin) {
        return;
      }

      // Responsive third-party iframe
      // This is a crude solution to an "impossible" problem.
      if (data.includes('height') || data.includes('width')) {
        setIframeSizes(JSON.parse(data));
      }
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  if (data?.type !== ContentType.isIframe) {
    return null;
  }

  return (
    <iframe
      ref={iframeRef}
      src={data.src}
      frameBorder="0"
      scrolling={data.scrollable ?? 'no'}
      width={iframeSizes?.width}
      height={iframeSizes?.height ?? data.defaultHeight ?? 600}
      style={{ width: '1px', minWidth: '100%' }}
    ></iframe>
  );
}

export default ContentIframe;

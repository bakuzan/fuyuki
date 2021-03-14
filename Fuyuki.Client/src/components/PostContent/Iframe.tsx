import React, { useEffect, useRef, useState } from 'react';

import { isContentIframe } from 'src/utils/content/types/ContentMeta';

import { ContentProps } from './ContentProps';

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
      if (event.origin === window.location.origin) {
        return;
      }
      const eData = event.data;
      // Responsive third-party iframe (note: imgur albums trigger this, others may too who knows.)
      // This is a crude solution to an "impossible" problem.
      if (eData && (eData.includes('height') || eData.includes('width'))) {
        setIframeSizes(JSON.parse(eData));
      }
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  if (!isContentIframe(data)) {
    return null;
  }

  const frameWidth = iframeSizes?.width ?? data.width;
  const frameHeight =
    iframeSizes?.height ?? data.height ?? data.defaultHeight ?? 600;

  return (
    <div>
      <iframe
        ref={iframeRef}
        className="post-content__iframe"
        src={data.src}
        frameBorder="0"
        scrolling={data.scrollable ?? 'no'}
        width={frameWidth}
        height={frameHeight}
        style={
          frameWidth === undefined ? { width: '1px', minWidth: '100%' } : {}
        }
      ></iframe>
    </div>
  );
}

export default ContentIframe;

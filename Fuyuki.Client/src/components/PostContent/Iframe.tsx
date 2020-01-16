import React, { useState, useEffect, useRef } from 'react';

import { Button } from 'meiko/Button';
import LoadingBouncer from 'meiko/LoadingBouncer';

import { ContentProps } from './ContentProps';
import { useAsyncFn } from 'src/hooks/useAsyncFn';
import { ContentType } from 'src/utils/content/types/ContentType';
import sendRequest from 'src/utils/sendRequest';

interface IframeSizes {
  [key: string]: any;
  height: number;
  width: number;
}

interface RequestVideoResponse {
  success: boolean;
  error?: Error | string;
}

function ContentIframe({ data }: ContentProps) {
  const [iframeSizes, setIframeSizes] = useState<IframeSizes | undefined>();
  const iframeRef = useRef(null);

  const [videoResponse, requestVreddit] = useAsyncFn<RequestVideoResponse, any>(
    async (url: string) =>
      await sendRequest('/Reddit/RequestVideo', {
        method: 'POST',
        body: JSON.stringify({ url })
      })
  );

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const { data } = event;
      if (event.origin === window.location.origin) {
        return;
      }

      // Responsive third-party iframe (note: imgur albums trigger this, others may too who knows.)
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

  const showVredditDownloadRequester = data.vreddit !== undefined;
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

      {showVredditDownloadRequester && (
        <div className="vreddit-downloader">
          {videoResponse.loading && (
            <LoadingBouncer className="loading-bouncer--local" />
          )}
          {!videoResponse.loading && videoResponse.value === undefined && (
            <Button
              className="vreddit-downloader__button"
              btnStyle="accent"
              onClick={() => requestVreddit(data.vreddit)}
            >
              Request download of vreddit video
            </Button>
          )}
          {!!videoResponse.value?.success && (
            <div className="vreddit-downloader__message vreddit-downloader__message--success">
              Video successfully requested.
            </div>
          )}
          {videoResponse.value && !videoResponse.value.success && (
            <div className="vreddit-downloader__message vreddit-downloader__message--error">
              Video request failed.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ContentIframe;

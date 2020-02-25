import React, { useContext, useEffect, useRef, useState } from 'react';

import { Button } from 'meiko/Button';
import LoadingBouncer from 'meiko/LoadingBouncer';

import { MainContext } from 'src/context';
import { useAsyncFn } from 'src/hooks/useAsyncFn';
import { isContentIframe } from 'src/utils/content/types/ContentMeta';
import sendRequest from 'src/utils/sendRequest';
import { ContentProps } from './ContentProps';

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
  const { onMessageRefresh } = useContext(MainContext);
  const [iframeSizes, setIframeSizes] = useState<IframeSizes | undefined>();
  const iframeRef = useRef(null);

  const [videoResponse, requestVreddit] = useAsyncFn<RequestVideoResponse, any>(
    async (url: string) =>
      await sendRequest('/Reddit/RequestVideo', {
        body: JSON.stringify({ url }),
        method: 'POST'
      })
  );

  const triggerRefresh = videoResponse.value?.success ?? false;
  useEffect(() => {
    if (triggerRefresh) {
      onMessageRefresh();
    }
  }, [triggerRefresh]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin === window.location.origin) {
        return;
      }
      const eData = event.data;
      // Responsive third-party iframe (note: imgur albums trigger this, others may too who knows.)
      // This is a crude solution to an "impossible" problem.
      if (eData.includes('height') || eData.includes('width')) {
        setIframeSizes(JSON.parse(eData));
      }
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  if (!isContentIframe(data)) {
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

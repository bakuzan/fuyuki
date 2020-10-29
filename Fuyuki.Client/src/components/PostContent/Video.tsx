import React, { useContext, useEffect, useRef, useState } from 'react';

import { Button } from 'meiko/Button';
import LoadingBouncer from 'meiko/LoadingBouncer';

import { MainContext } from 'src/context';
import { useAsyncFn } from 'src/hooks/useAsyncFn';

import {
  isContentVideo,
  VideoSource
} from 'src/utils/content/types/ContentMeta';
import sendRequest from 'src/utils/sendRequest';
import { ContentProps } from './ContentProps';

interface RequestVideoResponse {
  success: boolean;
  error?: Error | string;
}

function ContentVideo({ data }: ContentProps) {
  const { onMessageRefresh } = useContext(MainContext);
  const [hasRendered, setHasRendered] = useState(false);
  const playerRef = useRef<dashjs.MediaPlayerClass>();
  const videoRef = useRef<HTMLVideoElement | undefined>();
  const firstSrc = isContentVideo(data) && data.sources[0].src;

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
      onMessageRefresh(60);
    }
  }, [triggerRefresh]);

  useEffect(() => {
    if (hasRendered && firstSrc && firstSrc.includes('blob:')) {
      import(/* webpackChunkName: "dashjs" */ 'dashjs').then((dashjs) => {
        playerRef.current = dashjs.MediaPlayer().create();
        playerRef.current.initialize();
        playerRef.current.setAutoPlay(false);
        playerRef.current.attachView(videoRef.current as HTMLVideoElement);
        playerRef.current.attachSource(firstSrc);
        console.log('render video content...', playerRef, videoRef);
      });
    } else if (!hasRendered) {
      setHasRendered(true);
    }
  }, [firstSrc, hasRendered]);

  if (!isContentVideo(data)) {
    return null;
  }

  const showVredditDownloadRequester = data.vreddit !== undefined;
  const useAsVideoSrc =
    data.sources.length === 1 &&
    data.sources.every((x) => x.src.includes('blob:'));

  const videoProps = {
    autoPlay: !useAsVideoSrc,
    className: 'post-content__video',
    controls: true,
    height: 500,
    loop: true,
    muted: data.muted
  };

  return (
    <div>
      {useAsVideoSrc && (
        <video
          {...videoProps}
          ref={videoRef as React.RefObject<HTMLVideoElement>}
        ></video>
      )}
      {!useAsVideoSrc && (
        <video {...videoProps}>
          {data.sources.map((x: VideoSource) => (
            <source key={x.src} {...x}></source>
          ))}
        </video>
      )}

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

export default ContentVideo;

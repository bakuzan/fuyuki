import React, { useEffect, useRef, useState } from 'react';

import {
  isContentVideo,
  VideoSource
} from 'src/utils/content/types/ContentMeta';
import { ContentProps } from './ContentProps';

function ContentVideo({ data }: ContentProps) {
  const [hasRendered, setHasRendered] = useState(false);
  const playerRef = useRef<dashjs.MediaPlayerClass>();
  const videoRef = useRef<HTMLVideoElement | undefined>();
  const firstSrc = isContentVideo(data) && data.sources[0].src;

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
    </div>
  );
}

export default ContentVideo;

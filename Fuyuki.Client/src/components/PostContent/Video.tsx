import React from 'react';

import {
  isContentVideo,
  VideoSource
} from 'src/utils/content/types/ContentMeta';
import { ContentProps } from './ContentProps';

function ContentVideo({ data }: ContentProps) {
  if (!isContentVideo(data)) {
    return null;
  }

  return (
    <div>
      <video
        className="post-content__video"
        autoPlay
        controls
        loop
        height={500}
      >
        {data.sources.map((x: VideoSource) => (
          <source key={x.src} {...x}></source>
        ))}
      </video>
    </div>
  );
}

export default ContentVideo;

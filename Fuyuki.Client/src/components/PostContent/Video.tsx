import React from 'react';

import { ContentProps } from './ContentProps';
import { VideoSource } from 'src/utils/content/types/ContentMeta';
import { ContentType } from 'src/utils/content/types/ContentType';

function ContentVideo({ data }: ContentProps) {
  if (data?.type !== ContentType.isVideo) {
    return null;
  }

  return (
    <video className="post-content__video" autoPlay controls loop>
      {data.sources.map((x: VideoSource) => (
        <source key={x.src} {...x}></source>
      ))}
    </video>
  );
}

export default ContentVideo;

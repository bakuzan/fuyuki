import React from 'react';

import { ContentProps } from './ContentProps';
import { VideoSource } from 'src/utils/content/types/ContentMeta';
import { ContentType } from 'src/utils/content/types/ContentType';

const audioLabel = `The current video has audio available that may not be playable on fuyuki. To listen to the audio, view this post on reddit.`;
const speakerIcon = `\uD83D\uDD0A\uFE0F`;

function ContentVideo({ data }: ContentProps) {
  if (data?.type !== ContentType.isVideo) {
    return null;
  }

  const displayMissingAudioWarning = data.hasAudio === true;

  return (
    <div>
      {displayMissingAudioWarning && (
        <div
          className="post-content__audio-icon"
          aria-label={audioLabel}
          title={audioLabel}
        >
          <span aria-hidden={true}>{speakerIcon}</span>
        </div>
      )}
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

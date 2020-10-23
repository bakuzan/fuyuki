import React from 'react';

import Image from 'meiko/Image';

import { isContentImageGallery } from 'src/utils/content/types/ContentMeta';
import { ContentProps } from './ContentProps';

function ContentImageGallery({ data }: ContentProps) {
  if (!isContentImageGallery(data)) {
    return null;
  }

  return (
    <div>
      {data.sources.map((x, i) => (
        <Image
          key={i}
          className="post-content__image"
          src={x.src}
          alt={x.caption ?? `gallery entry ${i + 1}`}
          style={{ maxHeight: `800px` }}
        />
      ))}
    </div>
  );
}

export default ContentImageGallery;

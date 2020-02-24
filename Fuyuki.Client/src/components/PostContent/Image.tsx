import React from 'react';

import Image from 'meiko/Image';

import { isContentImage } from 'src/utils/content/types/ContentMeta';
import { ContentProps } from './ContentProps';

function ContentImage({ data }: ContentProps) {
  if (!isContentImage(data)) {
    return null;
  }

  return (
    <Image
      className="post-content__image"
      src={data.src}
      alt="post content source"
      style={{ maxHeight: `800px` }}
    />
  );
}

export default ContentImage;

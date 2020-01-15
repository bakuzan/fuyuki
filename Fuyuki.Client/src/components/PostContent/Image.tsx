import React from 'react';

import Image from 'meiko/Image';

import { ContentProps } from './ContentProps';
import { ContentType } from 'src/utils/content/types/ContentType';

function ContentImage({ data }: ContentProps) {
  if (data?.type !== ContentType.isImage) {
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

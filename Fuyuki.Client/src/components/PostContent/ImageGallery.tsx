import React, { useEffect, useState } from 'react';

import { Button } from 'meiko/Button';
import MkoIcons from 'meiko/constants/icons';
import Image from 'meiko/Image';

import Tickbox from 'meiko/Tickbox';
import { isContentImageGallery } from 'src/utils/content/types/ContentMeta';
import { ContentProps } from './ContentProps';

function ContentImageGallery({ data }: ContentProps) {
  const [showAll, setShowAll] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (showAll && index !== 0) {
      setIndex(0);
    }
  }, [showAll, index]);

  if (!isContentImageGallery(data)) {
    return null;
  }

  const images = showAll ? data.sources : data.sources.slice(index, index + 1);

  return (
    <div>
      <Tickbox
        id="imageGalleryShowAll"
        name="showAll"
        text="Show all gallery images"
        checked={showAll}
        onChange={() => setShowAll((p) => !p)}
      />
      <div className="image-gallery">
        {!showAll && (
          <Button
            id="imageGalleryPrev"
            className="image-gallery__button"
            btnStyle="accent"
            icon={MkoIcons.left}
            title="Go to previous image"
            aria-label="Go to previous image"
            disabled={index === 0}
            onClick={() => setIndex((p) => p - 1)}
          ></Button>
        )}
        {images.map((x, i) => {
          const imageNumber = showAll ? i + 1 : index + 1;

          return (
            <Image
              key={i}
              className="post-content__image"
              src={x.src}
              alt={x.caption ? x.caption : `gallery entry ${imageNumber}`}
              style={{ maxHeight: `800px` }}
            />
          );
        })}
        {!showAll && (
          <Button
            id="imageGalleryNext"
            className="image-gallery__button"
            btnStyle="accent"
            icon={MkoIcons.right}
            title="Go to next image"
            aria-label="Go to next image"
            disabled={index === data.sources.length - 1}
            onClick={() => setIndex((p) => p + 1)}
          ></Button>
        )}
      </div>
    </div>
  );
}

export default ContentImageGallery;

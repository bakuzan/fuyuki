/* tslint:disable:object-literal-sort-keys */
import { Post } from '../../../interfaces/Post';
import getImageUrl from '../../getImageUrl';
import { ContentMatcher } from '../types/ContentMatcher';
import { ContentMeta } from '../types/ContentMeta';
import { ContentType } from '../types/ContentType';

function match(post: Post) {
  return post.url.includes('imgur');
}

async function meta(post: Post): Promise<ContentMeta> {
  const isAlbum = post.url.includes('/a/');
  const isGifv = post.url.includes('.gifv');

  if (isAlbum) {
    const id = post.url.split('/a/').slice(-1)[0];
    const src = `https://imgur.com/a/${id}/embed?pub=true&ref=https://imgur.com/a/${id}&analytics=false`;

    return {
      type: ContentType.isIframe,
      src,
      defaultHeight: 700
    };
  } else if (isGifv) {
    return {
      type: ContentType.isVideo,
      sources: [
        {
          src: post.url.replace('.gifv', '.mp4'),
          type: 'video/mp4'
        }
      ]
    };
  }

  return {
    type: ContentType.isImage,
    src: getImageUrl(post.url)
  };
}

const matcher: ContentMatcher = {
  match,
  meta
};

export default matcher;

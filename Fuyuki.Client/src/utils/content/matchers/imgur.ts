/* tslint:disable:object-literal-sort-keys */
import { Post } from '../../../interfaces/Post';
import getImageUrl from '../../getImageUrl';
import { ContentMatcher } from '../types/ContentMatcher';
import { ContentMeta } from '../types/ContentMeta';
import { ContentType } from '../types/ContentType';

// Guya proxy format: https://guya.moe/proxy/imgur/<albumId>/1/1/

function match(post: Post) {
  return post.url.includes('imgur');
}

async function meta(post: Post): Promise<ContentMeta> {
  const isProxy = post.url.includes('guya.moe');
  const isAlbum = post.url.includes('/a/') || isProxy;
  const isGifv = post.url.includes('.gifv');

  if (isAlbum) {
    const id = isProxy
      ? post.url
          .replace(/^.*imgur/, '')
          .slice(1)
          .split('/')[0]
      : post.url.split('/a/').slice(-1)[0];

    return {
      type: ContentType.isIframe,
      src: `https://imgur.com/a/${id}/embed?pub=true&ref=https://imgur.com/a/${id}&analytics=false`,
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

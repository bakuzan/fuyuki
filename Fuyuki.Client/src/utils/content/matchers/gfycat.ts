import { Post } from '../../../interfaces/Post';

import { ContentType } from '../types/ContentType';
import { ContentMeta } from '../types/ContentMeta';
import { ContentMatcher } from '../types/ContentMatcher';
import sendRequest from 'src/utils/sendRequest';

function match(post: Post) {
  const embedDomains = ['gfycat'];
  return (post.url && embedDomains.some((x) => post.url.includes(x))) || false;
}

async function meta(post: Post): Promise<ContentMeta> {
  const id = post.url.replace(/^.*\/|-.*/g, '');

  const response = await sendRequest(`/Content/Gfycat/${id}`, {
    headers: {
      'Cache-Control': 'max-age=3600'
    }
  });

  if (!response.success) {
    // TODO
    // Create a ContentType.isError to handle these nicely...
  }

  const { gfyItem } = JSON.parse(response.content);

  return {
    type: ContentType.isVideo,
    sources: [
      {
        src: gfyItem.webmUrl,
        type: 'video/webm'
      },
      {
        src: gfyItem.mp4Url,
        type: 'video/webm'
      }
    ]
  };
}

const matcher: ContentMatcher = {
  match,
  meta
};

export default matcher;

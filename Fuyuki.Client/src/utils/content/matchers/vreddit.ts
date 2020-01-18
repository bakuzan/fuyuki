/* tslint:disable:object-literal-sort-keys */
import sendRequest from 'src/utils/sendRequest';
import { Post } from '../../../interfaces/Post';
import { ContentMatcher } from '../types/ContentMatcher';
import { ContentMeta, VideoSource } from '../types/ContentMeta';
import { ContentType } from '../types/ContentType';

function sortBy(arr: any[], fn: (item: any) => any) {
  return arr.sort((a, b) => {
    const bv = fn(b);
    const av = fn(a);
    return bv > av ? 1 : bv < av ? -1 : 0;
  });
}

function match(post: Post) {
  return post.url.includes('v.redd.it');
}

async function meta(post: Post): Promise<ContentMeta> {
  const id = post.url.split('/').slice(-1)[0];
  const response = await sendRequest(`/Content/Vreddit/${id}`);

  if (!response.success) {
    // TODO
    // Custom error...
  }

  const mpd = response.content;
  const manifest = new DOMParser().parseFromString(mpd, 'text/xml');

  const reps = Array.from(manifest.querySelectorAll('Representation'));
  const rawSources = sortBy(reps, (rep: Element) =>
    parseInt(rep.getAttribute('bandwidth') || '', 10)
  );

  // Audio is in a seperate stream, and requires a heavy dash dependency to add to the video
  if (manifest.querySelector('AudioChannelConfiguration')) {
    const frameSource = rawSources[0] as Element;
    const height = Number(frameSource.getAttribute('height'));
    const width = Number(frameSource.getAttribute('width'));

    return {
      type: ContentType.isIframe,
      src: `//www.redditmedia.com/mediaembed/${post.id}`,
      vreddit: post.permalink,
      height: height || undefined,
      width: width || undefined
    };
  }

  const sources: VideoSource[] = rawSources
    .map((rep: Element) => rep.querySelector('BaseURL'))
    .map((baseUrl: Element | null) => ({
      src: `https://v.redd.it/${id}/${baseUrl?.textContent ?? ''}`,
      type: 'video/mp4'
    }));

  return {
    type: ContentType.isVideo,
    sources
  };
}

const matcher: ContentMatcher = {
  match,
  meta
};

export default matcher;

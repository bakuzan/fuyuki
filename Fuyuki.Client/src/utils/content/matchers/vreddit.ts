import { ContentType } from '../types/ContentType';
import { Post } from '../../../interfaces/Post';
import { ContentMeta, VideoSource } from '../types/ContentMeta';
import { ContentMatcher } from '../types/ContentMatcher';
import sendRequest from 'src/utils/sendRequest';

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
  let hasAudio = false;
  const id = post.url.split('/').slice(-1)[0];
  const response = await sendRequest(`/Content/Vreddit/${id}`);

  if (!response.success) {
    // TODO
    // Custom error...
  }

  const mpd = response.content;
  const manifest = new DOMParser().parseFromString(mpd, 'text/xml');

  // Audio is in a seperate stream, and requires a heavy dash dependency to add to the video
  if (manifest.querySelector('AudioChannelConfiguration')) {
    hasAudio = true;
  }

  const reps = Array.from(manifest.querySelectorAll('Representation'));
  const sources: VideoSource[] = sortBy(reps, (rep: Element) =>
    parseInt(rep.getAttribute('bandwidth') || '', 10)
  )
    .reverse()
    .map((rep: Element) => rep.querySelector('BaseURL'))
    .map((baseUrl: Element | null) => ({
      src: `https://v.redd.it/${id}/${baseUrl?.textContent ?? ''}`,
      type: 'video/mp4'
    }));

  return {
    type: ContentType.isVideo,
    sources,
    hasAudio
  };
}

const matcher: ContentMatcher = {
  match,
  meta
};

export default matcher;

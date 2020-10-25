/* tslint:disable:object-literal-sort-keys */
import alertService from 'src/utils/alertService';
import sendRequest from 'src/utils/sendRequest';
import { Post } from '../../../interfaces/Post';
import { ContentMatcher } from '../types/ContentMatcher';
import { ContentMeta, VideoSource } from '../types/ContentMeta';
import { ContentType } from '../types/ContentType';

const minBandwidth = 3000 * 1000;

function sortBy<T>(arr: T[], fn: (item: T) => any) {
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
    alertService.showError(
      `vreddit request failed.`,
      response.errorMessages[0]
    );

    return { type: ContentType.isError };
  }

  const mpd = response.content;
  const manifest = new DOMParser().parseFromString(mpd, 'text/xml');

  const reps = Array.from(
    manifest.querySelectorAll('Representation[frameRate]')
  );
  const rawSources = sortBy(reps, (rep) =>
    parseInt(rep.getAttribute('bandwidth') || '', 10)
  );

  const filteredSources: Element[] = [];

  for (const item of rawSources) {
    const bandwidth = parseInt(item.getAttribute('bandwidth') || '', 10);

    if (item === rawSources[0] || bandwidth >= minBandwidth) {
      filteredSources.push(item);
    } else {
      item.remove();
    }
  }

  const muted = !manifest.querySelector('AudioChannelConfiguration');
  const sources: VideoSource[] = [];

  if (muted && id) {
    sources.push(
      ...filteredSources
        .map((rep: Element) => rep.querySelector('BaseURL'))
        .map((baseUrl: Element | null) => ({
          src: `https://v.redd.it/${id}/${baseUrl?.textContent ?? ''}`,
          type: 'video/mp4'
        }))
    );
  } else {
    sources.push({
      src: URL.createObjectURL(
        new Blob([new XMLSerializer().serializeToString(manifest)], {
          type: 'application/dash+xml'
        })
      ),
      type: 'application/dash+xml'
    });
  }

  if (sources.length === 0) {
    alertService.showError(
      `vreddit request failed.`,
      'No valid sources found.'
    );

    return { type: ContentType.isError };
  }

  return {
    type: ContentType.isVideo,
    sources,
    muted
  };
}

const matcher: ContentMatcher = {
  match,
  meta
};

export default matcher;

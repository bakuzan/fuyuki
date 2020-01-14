import constructObjectFromSearchParams from 'ayaka/constructObjectFromSearchParams';

import { Post } from 'src/interfaces/Post';
import getImageUrl from 'src/utils/getImageUrl';
import hasImageExtension from 'src/utils/hasImageExtension';

export enum ContentType {
  isNone,
  isText,
  isImage,
  isVideo,
  isIframe
}

export type ContentHost =
  | {
      type: ContentType.isNone | ContentType.isText | ContentType.isVideo;
      url?: (post: Post) => string;
      matches?: (url: string) => boolean;
    }
  | {
      type: ContentType.isImage | ContentType.isIframe;
      url: (post: Post) => string;
      matches: (url: string) => boolean;
      scrollable?: string;
      defaultHeight?: number;
    };

const hosts: ContentHost[] = [
  {
    type: ContentType.isVideo,
    matches: (url: string) => url.includes('imgur') && url.includes('.gifv'),
    url: (post: Post) => post.url.replace('.gifv', '.mp4')
  },
  {
    type: ContentType.isImage,
    matches: hasImageExtension,
    url: (post: Post) => post.url
  },

  {
    type: ContentType.isImage,
    matches: (url: string) => url.includes('imgur') && !url.includes('/a/'),
    url: (post: Post) => getImageUrl(post.url)
  },
  {
    type: ContentType.isIframe,
    matches: (url: string) => url.includes('imgur') && url.includes('/a/'),
    url: (post: Post) => {
      const id = post.url.split('/a/').slice(-1)[0];
      return `https://imgur.com/a/${id}/embed?pub=true&ref=https://imgur.com/a/${id}&analytics=false`;
    },
    defaultHeight: 700
  },
  {
    type: ContentType.isIframe,
    matches: (url: string) => {
      const embedDomains = ['gfycat', 'twitch', 'youtube', 'youtu.be', 'vimeo'];
      return (url && embedDomains.some((x) => url.includes(x))) || false;
    },
    url: (post: Post) => `//www.redditmedia.com/mediaembed/${post.id}`,
    defaultHeight: 350
  },
  {
    type: ContentType.isIframe,
    matches: (url: string) => {
      const embedDomains = ['v.redd.it'];
      return (url && embedDomains.some((x) => url.includes(x))) || false;
    },
    url: (post: Post) => `//www.redditmedia.com/mediaembed/${post.id}`,
    defaultHeight: 650
  },
  {
    type: ContentType.isIframe,
    matches: (url: string) => url.includes('streamable'),
    url: (post: Post) => {
      const uid = post.url.split('/').slice(-1)[0];
      return post.url.includes('/s/')
        ? post.url
        : `https://streamable.com/s/${uid}`;
    },
    defaultHeight: 350
  },
  {
    type: ContentType.isIframe,
    matches: (url: string) => url.includes('viewKey='),
    url: (post: Post) => {
      const params = constructObjectFromSearchParams(post.url);
      return `https://www.pornhub.com/embed/${params.viewKey}`;
    },
    defaultHeight: 350
  },
  {
    type: ContentType.isIframe,
    matches: (url: string) => url.includes('wikipedia'),
    url: (post: Post) => post.url,
    scrollable: 'yes',
    defaultHeight: 600
  }
];

export default hosts;

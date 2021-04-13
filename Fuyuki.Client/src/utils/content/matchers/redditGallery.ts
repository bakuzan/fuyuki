// tslint:disable:object-literal-sort-keys
import filterFalsey from 'ayaka/helpers/filterFalsey';
import alertService from 'src/utils/alertService';
import sendRequest from 'src/utils/sendRequest';
import { Post } from '../../../interfaces/Post';
import { ContentMatcher } from '../types/ContentMatcher';
import { ContentMeta, ImageSource } from '../types/ContentMeta';
import { ContentType } from '../types/ContentType';

interface MediaItem {
  media_id: string;
  caption?: string;
}

interface MetaBlockData {
  media_metadata: any;
  gallery_data: { items: MediaItem[] };
}

interface MetaBlock {
  data: MetaBlockData;
}

function match(post: Post) {
  return post.url.includes('reddit.com/gallery/');
}

async function meta(post: Post): Promise<ContentMeta> {
  const response = await sendRequest(
    `/Content/Metadata?permalink=${post.permalink}`
  );

  if (!response.success) {
    alertService.showError(
      `post metadata request failed.`,
      response.errorMessages[0]
    );

    return { type: ContentType.isError };
  }

  const part = JSON.parse(response.content)[0];
  const data = part.data.children.map((c: MetaBlock) => c.data)[0];

  const crosspostParentList = data.crosspost_parent_list ?? [];
  const { gallery_data: galleryData = {} } = data;
  let items = galleryData?.items ?? [];

  let { media_metadata: mediaMetadata = {} } = data;
  const mediaMetaKeys = Object.keys(mediaMetadata);

  if (items.length === 0 && crosspostParentList.length) {
    const crosspostData = crosspostParentList[0];
    mediaMetadata = crosspostData.media_metadata ?? {};
    items = crosspostData.gallery_data?.items ?? [];
  } else if (items.length === 0 && mediaMetaKeys.length) {
    items = mediaMetaKeys.map((media_id) => ({ media_id }));
  }

  const sources = (items as MediaItem[]).map(({ media_id, caption }) => {
    // `m` is something like `image/png`
    const { m } = mediaMetadata[media_id] || {};

    return m.startsWith('image')
      ? ({
          src: `https://i.redd.it/${media_id}.${m.substr(6)}`,
          caption: caption ?? ''
        } as ImageSource)
      : undefined;
  });

  if (items.length === 0) {
    const baseItemCount = galleryData?.items?.length ?? 0;
    const hasCrosspost = !!crosspostParentList.length;

    alertService.showError(
      `Reddit gallery had no image sources.`,
      `Base post gallery items: ${baseItemCount}, Has crosspost data: ${hasCrosspost}`
    );

    return { type: ContentType.isError };
  }

  return {
    type: ContentType.isImageGallery,
    sources: sources.filter(filterFalsey)
  };
}

const matcher: ContentMatcher = {
  match,
  meta
};

export default matcher;

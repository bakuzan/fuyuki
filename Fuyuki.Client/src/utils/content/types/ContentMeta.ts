import { ContentType } from './ContentType';

export interface VideoSource {
  src: string;
  type: string;
}

export interface ImageSource {
  src: string;
  caption: string;
}

interface ContentBase {
  type: ContentType.isError | ContentType.isNone | ContentType.isText;
}

interface ContentVideo {
  type: ContentType.isVideo;
  sources: VideoSource[];
  muted: boolean;
}

interface ContentImageGallery {
  type: ContentType.isImageGallery;
  sources: ImageSource[];
}

interface ContentImage {
  type: ContentType.isImage;
  src: string;
}

interface ContentIframe {
  type: ContentType.isIframe;
  src: string;
  vreddit?: string;
  width?: number;
  height?: number;
  scrollable?: string;
  defaultHeight?: number;
}

export type ContentMeta =
  | ContentBase
  | ContentVideo
  | ContentImage
  | ContentIframe
  | ContentImageGallery;

export function isContentBase(meta?: ContentMeta): meta is ContentBase {
  return [ContentType.isError, ContentType.isNone, ContentType.isText].includes(
    meta?.type ?? ContentType.isNone
  );
}

export function isContentVideo(meta?: ContentMeta): meta is ContentVideo {
  return meta?.type === ContentType.isVideo;
}

export function isContentImage(meta?: ContentMeta): meta is ContentImage {
  return meta?.type === ContentType.isImage;
}

export function isContentImageGallery(
  meta?: ContentMeta
): meta is ContentImageGallery {
  return meta?.type === ContentType.isImageGallery;
}

export function isContentIframe(meta?: ContentMeta): meta is ContentIframe {
  return meta?.type === ContentType.isIframe;
}

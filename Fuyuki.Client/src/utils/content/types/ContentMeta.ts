import { ContentType } from './ContentType';

export interface VideoSource {
  src: string;
  type: string;
}

export type ContentMeta =
  | {
      type: ContentType.isError | ContentType.isNone | ContentType.isText;
    }
  | {
      type: ContentType.isVideo;
      sources: VideoSource[];
    }
  | {
      type: ContentType.isImage;
      src: string;
    }
  | {
      type: ContentType.isIframe;
      src: string;
      vreddit?: string;
      width?: number;
      height?: number;
      scrollable?: string;
      defaultHeight?: number;
    };

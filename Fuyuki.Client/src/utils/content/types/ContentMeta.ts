import { ContentType } from './ContentType';

export interface VideoSource {
  src: string;
  type: string;
}

export type ContentMeta =
  | {
      type: ContentType.isNone | ContentType.isText;
    }
  | {
      type: ContentType.isVideo;
      sources: VideoSource[];
      hasAudio?: boolean;
    }
  | {
      type: ContentType.isImage;
      src: string;
      width?: number;
      height?: number;
    }
  | {
      type: ContentType.isIframe;
      src: string;
      width?: number;
      height?: number;
      scrollable?: string;
      defaultHeight?: number;
    };

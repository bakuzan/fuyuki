import { NanoRenderer } from 'nano-css';

declare module 'meiko/styles/TagChip' {
  interface CSSLikeObject {
    [selector: string]: any | CSSLikeObject;
  }

  declare const TagChipStyle: CSSLikeObject;

  export = TagChipStyle;
}

declare module 'meiko/styles/nano' {
  export declare const nano: NanoRenderer;
}

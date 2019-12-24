declare module 'meiko/styles/TagChip' {
  interface CSSLikeObject {
    [selector: string]: any | CSSLikeObject;
  }

  declare const TagChipStyle: CSSLikeObject;

  export = TagChipStyle;
}

declare module 'meiko/styles/TagChip' {
  interface CSSLikeObject {
    [selector: string]: any | CSSLikeObject;
  }

  export = CSSLikeObject;
}

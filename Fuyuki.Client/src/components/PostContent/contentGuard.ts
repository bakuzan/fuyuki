import { ContentMeta } from 'src/utils/content/types/ContentMeta';
import { ContentType } from 'src/utils/content/types/ContentType';

export function typeGuard(type: ContentType, meta?: ContentMeta) {
  return meta?.type === type ?? false;
}

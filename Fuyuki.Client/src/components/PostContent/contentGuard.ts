import { ContentType } from 'src/utils/content/types/ContentType';
import { ContentMeta } from 'src/utils/content/types/ContentMeta';

export function typeGuard(type: ContentType, meta?: ContentMeta) {
  return meta?.type === type ?? false;
}

import { Post } from '../../interfaces/Post';
import hosts, { ContentHost, ContentType } from './contentHosts';

export class ContentManager {
  public isExpandable(post: Post) {
    return this.processContent(post).type !== ContentType.isNone;
  }

  public processContent(post: Post): ContentHost {
    if (post.isSelf) {
      return { type: ContentType.isText };
    } else if (post.isVideo && !post.url.includes('v.redd.it')) {
      return { type: ContentType.isVideo };
    }

    const host = hosts.find((x) => x.matches && x.matches(post.url));
    return host || { type: ContentType.isNone };
  }
}

const cm = new ContentManager();

export default cm;

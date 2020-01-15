import React, { useEffect } from 'react';

import Iframe from './Iframe';
import Image from './Image';
import Video from './Video';

import { Post } from 'src/interfaces/Post';
import { useAsyncFn } from 'src/hooks/useAsyncFn';
import { ContentManager } from 'src/utils/content/manager';
import { ContentType } from 'src/utils/content/types/ContentType';
import { ContentMeta } from 'src/utils/content/types/ContentMeta';
import { typeGuard } from './contentGuard';

import './PostContent.scss';

interface PostContentProps {
  data: Post;
  isExpanded: boolean;
}

function PostContent(props: PostContentProps) {
  const { isExpanded, data: x } = props;

  const getContentMeta = ContentManager.getContentMetaFunction(x);
  const [state, fetchMeta] = useAsyncFn<ContentMeta, any>(getContentMeta);
  const meta = state.value as ContentMeta;

  useEffect(() => {
    if (isExpanded) {
      fetchMeta(x);
    }
  }, [isExpanded, x]);

  if (!isExpanded) {
    return null;
  }

  return (
    <div className="post-content">
      {typeGuard(ContentType.isText, meta) && (
        <div className="post-content__text-body">
          <div
            dangerouslySetInnerHTML={{
              __html: x.textBody
            }}
          ></div>
        </div>
      )}
      <Video data={meta} />
      <Image data={meta} />
      <Iframe data={meta} />
    </div>
  );
}

export default PostContent;

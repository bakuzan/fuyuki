import React from 'react';

import Image from 'meiko/Image';

import isImageURL from 'src/utils/isImageURL';
import { Post } from 'src/interfaces/Post';

import './PostContent.scss';

interface PostContentProps {
  data: Post;
  isExpanded: boolean;
}

function PostContent(props: PostContentProps) {
  const x = props.data;
  const hasTextBody = x.isSelf;
  const isVideo = x.isVideo;
  const isImage = !x.isSelf && !x.isVideo && isImageURL(x.url);

  if (!props.isExpanded) {
    return null;
  }

  return (
    <div className="post-content">
      {hasTextBody && (
        <div className="post-content__text-body">{x.textBody}</div>
      )}
      {isImage && (
        <Image
          className="post-content__image"
          src={x.url}
          alt="post content source"
        />
      )}
      {isVideo && (
        <video className="post-content__video" autoPlay controls>
          <source src={x.url}></source>
        </video>
      )}
    </div>
  );
}

export default PostContent;

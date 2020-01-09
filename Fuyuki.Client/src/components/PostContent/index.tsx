import React from 'react';

import Image from 'meiko/Image';

import isImageURL from 'src/utils/isImageURL';
import getImageUrl from 'src/utils/getImageUrl';
import isIframeContent from 'src/utils/isIframeContent';
import { Post } from 'src/interfaces/Post';

import './PostContent.scss';

interface PostContentProps {
  data: Post;
  isExpanded: boolean;
}

function PostContent(props: PostContentProps) {
  const x = props.data;
  const hasTextBody = x.isSelf;
  const isVideo = x.isVideo && !x.url.includes('v.redd.it');
  const isImage = !x.isSelf && !x.isVideo && isImageURL(x.url);
  const isIframe = !x.isSelf && !isImage && isIframeContent(x.url);

  if (!props.isExpanded) {
    return null;
  }

  return (
    <div className="post-content">
      {hasTextBody && (
        <div className="post-content__text-body">
          <div dangerouslySetInnerHTML={{ __html: x.textBody }}></div>
        </div>
      )}
      {isImage && (
        <Image
          className="post-content__image"
          src={getImageUrl(x.url)}
          alt="post content source"
        />
      )}
      {isVideo && (
        <video className="post-content__video" autoPlay controls>
          <source src={x.url}></source>
        </video>
      )}
      {isIframe && (
        <iframe
          src={`//www.redditmedia.com/mediaembed/${x.id}`}
          width={610}
          height={350}
          frameBorder="0"
          scrolling="no"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
}

export default PostContent;

import React, { useRef, useState, useEffect } from 'react';

import Image from 'meiko/Image';

import { Post } from 'src/interfaces/Post';
import contentManager from './ContentManager';
import { ContentType } from './contentHosts';

import './PostContent.scss';

interface IframeSizes {
  [key: string]: any;
  height: number;
  width: number;
}

interface PostContentProps {
  data: Post;
  isExpanded: boolean;
}

function PostContent(props: PostContentProps) {
  const [iframeSizes, setIframeSizes] = useState<IframeSizes | undefined>();
  const iframeRef = useRef(null);
  const { data: x } = props;

  const host = contentManager.processContent(x);
  const isVideo = host.type === ContentType.isVideo;

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const { data } = event;
      if (event.origin === window.location.origin) {
        return;
      }

      // Responsive third-party iframe
      // This is a crude solution to an "impossible" problem.
      if (data.includes('height') || data.includes('width')) {
        setIframeSizes(JSON.parse(data));
      }
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  if (!props.isExpanded) {
    return null;
  }

  return (
    <div className="post-content">
      {host.type === ContentType.isText && (
        <div className="post-content__text-body">
          <div
            dangerouslySetInnerHTML={{
              __html: x.textBody
            }}
          ></div>
        </div>
      )}
      {isVideo && (
        <video className="post-content__video" autoPlay controls loop>
          <source src={(host.url && host.url(x)) || x.url}></source>
        </video>
      )}
      {host.type === ContentType.isImage && (
        <Image
          className="post-content__image"
          src={host.url(x)}
          alt="post content source"
          style={{ maxHeight: `800px` }}
        />
      )}
      {host.type === ContentType.isIframe && (
        <iframe
          ref={iframeRef}
          src={host.url(x)}
          frameBorder="0"
          scrolling={host.scrollable ?? 'no'}
          width={iframeSizes?.width}
          height={iframeSizes?.height ?? host.defaultHeight ?? 600}
          style={{ width: '1px', minWidth: '100%' }}
        ></iframe>
      )}
    </div>
  );
}

export default PostContent;

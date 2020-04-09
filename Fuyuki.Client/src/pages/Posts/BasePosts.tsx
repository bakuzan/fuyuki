import classNames from 'classnames';
import React, { useState } from 'react';
import Helmet from 'react-helmet';

import { useWindowSize } from 'meiko/hooks/useWindowSize';

import Peekaboo from 'src/components/Peekaboo';
import Posts from 'src/components/Posts';
import { WidgetProps } from 'src/components/Widget';

import { PageProps } from 'src/interfaces/PageProps';
import { isXS } from 'src/utils/media';

import './Posts.scss';

const urlBase = `/reddit/posts`;

type RenderWidgetProps = Pick<
  WidgetProps,
  'isExpanded' | 'isLocked' | 'setExpanded'
>;

interface PostsPageProps extends PageProps {
  pageTitle: string;
  queryUrl: string;
  header?: React.ReactNode;
  children?: React.ReactNode;
  renderWidget(props: RenderWidgetProps): React.ReactNode;
}

function PostsPage(props: PostsPageProps) {
  const [expanded, setExpanded] = useState(false);

  const size = useWindowSize();
  const notASmallWindow = !isXS(size.width);
  const isExpanded = notASmallWindow || expanded;
  const shouldMargin = isExpanded;

  return (
    <div className="page">
      <Helmet title={props.pageTitle} />
      <section
        className={classNames('posts', {
          'posts--margin': shouldMargin
        })}
      >
        <Peekaboo
          className={classNames({ 'peekaboo--margin': shouldMargin })}
          threshold={200}
        >
          <header className="page__header page__header--spaced">
            <h2 className="page__title">{props.pageTitle}</h2>
            {props.header}
          </header>
          {props.children}
        </Peekaboo>
        <Posts endpoint={`${urlBase}${props.queryUrl}`} />
      </section>
      {props.renderWidget({
        isExpanded,
        isLocked: notASmallWindow,
        setExpanded
      })}
    </div>
  );
}

export default PostsPage;

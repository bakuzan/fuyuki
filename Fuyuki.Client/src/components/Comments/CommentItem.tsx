import React from 'react';

import FYKLink from '../FYKLink';
import AwardsBlock from '../AwardsBlock';
import Flair from '../FlairBlock';
import { Comment } from 'src/interfaces/Comment';
import thousandFormat from 'src/utils/thousandFormat';
import { Button } from 'meiko/Button';

interface CommentItemProps {
  index: number;
  data: Comment;
}

function CommentItem(props: CommentItemProps) {
  const x = props.data;
  return (
    <li className="posts__item">
      <article className="comment">placeholder</article>
    </li>
  );
}

export default React.memo(CommentItem);

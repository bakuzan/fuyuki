import classNames from 'classnames';
import React, { useState } from 'react';

import orderBy from 'ayaka/orderBy';

import FYKLink from '../FYKLink';
import { Group } from 'src/interfaces/Group';

interface GroupItemProps {
  data: Group;
}

function GroupItem(props: GroupItemProps) {
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const x = props.data;
  const subs = orderBy(x.subreddits || [], ['name']);
  const subsExist = !!x.subreddits;
  const subsEmpty = subs.length === 0;
  const groupItemLink = subsEmpty ? `/group/${x.id}` : `/fyk/posts/${x.id}`;

  return (
    <li className="groups__item">
      <FYKLink to={groupItemLink}>{x.name}</FYKLink>
      {!subsEmpty && (
        <ul className="tree">
          {subs.map((s, i) => {
            const highlight = i <= highlightIndex;
            const highlightExact = i === highlightIndex;

            return (
              <li
                key={s.id}
                className={classNames('tree__item', {
                  'tree__item--highlight': highlight,
                  'tree__item--highlight-exact': highlightExact
                })}
                onMouseEnter={() => setHighlightIndex(i)}
                onMouseLeave={() => setHighlightIndex(-1)}
              >
                <FYKLink noShadow to={`/r/posts/${s.name}`}>
                  {s.name}
                </FYKLink>
              </li>
            );
          })}
        </ul>
      )}
      {subsExist && subsEmpty && <div>This group has no subreddits.</div>}
    </li>
  );
}

export default React.memo(GroupItem);

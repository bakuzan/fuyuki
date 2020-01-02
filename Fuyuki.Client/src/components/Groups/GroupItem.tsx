import React from 'react';

import orderBy from 'ayaka/orderBy';

import FYKLink from '../FYKLink';
import { Group } from 'src/interfaces/Group';

interface GroupItemProps {
  data: Group;
}

function GroupItem(props: GroupItemProps) {
  const x = props.data;
  const subs = orderBy(x.subreddits || [], ['name']);
  const subsExist = !!x.subreddits;
  const subsEmpty = subs.length === 0;
  const groupItemLink = subsEmpty ? `group/${x.id}` : `posts/${x.id}`;
  console.log('GI: ', x);
  return (
    <li className="groups__item">
      <FYKLink to={groupItemLink}>{x.name}</FYKLink>
      {!subsEmpty && (
        <ul className="tree">
          {subs.map((s) => (
            <li key={s.id} className="tree__item">
              {s.name}
            </li>
          ))}
        </ul>
      )}
      {subsExist && subsEmpty && <div>This group has no subreddits.</div>}
    </li>
  );
}

export default GroupItem;

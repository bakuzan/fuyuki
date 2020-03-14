import classNames from 'classnames';
import React, { useState } from 'react';

import orderBy from 'ayaka/orderBy';
import MkoIcons from 'meiko/constants/icons';

import FYKLink from 'src/components/FYKLink';
import { GroupWithSubreddits } from 'src/interfaces/Group';
import { Subreddit } from 'src/interfaces/Subreddit';

interface GroupItemProps {
  data: GroupWithSubreddits;
  noSubredditsMessage?: string;
  filtered?: boolean;
}

const MIN_SUBREDDIT_DISPLAY = 5;

function GroupItem(props: GroupItemProps) {
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [expanded, setExpanded] = useState(false);

  const { filtered = false } = props;
  const x = props.data;
  const subs: Subreddit[] = orderBy(x.subreddits || [], ['name']);
  const subsExist = !!x.subreddits;
  const subsEmpty = subs.length === 0 || subs.every((s) => s.isHidden);
  const groupItemLink = subsEmpty ? `/group/${x.id}` : `/fyk/posts/${x.id}`;

  const showExpander =
    !expanded &&
    subsExist &&
    !subsEmpty &&
    !filtered &&
    subs.length > MIN_SUBREDDIT_DISPLAY;

  return (
    <li className="groups__item">
      <div>
        <FYKLink to={groupItemLink}>{x.name}</FYKLink>
        <span
          className="groups__subreddit-count"
          aria-label={`${subs.length} subreddits`}
        >
          <span aria-hidden={true}>({subs.length})</span>
        </span>
        <FYKLink
          className="groups__edit-link"
          to={`/group/${x.id}`}
          aria-label="Edit group"
        >
          <span aria-hidden={true}>{MkoIcons.editable}</span>
        </FYKLink>
      </div>
      {!subsEmpty && (
        <ul className="tree">
          {subs.map((s, i) => {
            const highlight = i <= highlightIndex;
            const highlightExact = i === highlightIndex;

            const reduceList =
              !filtered && !expanded && i + 1 > MIN_SUBREDDIT_DISPLAY;

            if (s.isHidden || reduceList) {
              return null;
            }

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
                <FYKLink
                  className="tree__link"
                  to={`/r/posts/${s.name}`}
                  title={s.name}
                  noShadow
                >
                  {s.name}
                </FYKLink>
              </li>
            );
          })}
          {showExpander && (
            <li
              key="EXPANDER"
              className={classNames(
                'tree__item',
                'tree__item--expander',
                MIN_SUBREDDIT_DISPLAY === highlightIndex && [
                  'tree__item--highlight',
                  'tree__item--highlight-exact'
                ]
              )}
              onMouseEnter={() => setHighlightIndex(MIN_SUBREDDIT_DISPLAY)}
              onMouseLeave={() => setHighlightIndex(-1)}
            >
              <button
                type="button"
                className="fyk-link fyk-link--shadowless tree__expander"
                aria-label={`show ${subs.length -
                  MIN_SUBREDDIT_DISPLAY} hidden subreddits`}
                onClick={() => setExpanded(true)}
              >
                <span aria-hidden={true}>+ show more</span>
              </button>
            </li>
          )}
        </ul>
      )}
      {subsExist && subsEmpty && (
        <div className="groups-no-subreddits">
          {props.noSubredditsMessage ?? 'This group has no subreddits.'}
        </div>
      )}
    </li>
  );
}

export default React.memo(GroupItem);

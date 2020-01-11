import classNames from 'classnames';
import React from 'react';

import { Awards } from '../../interfaces/Awards';
import typedKeys from '../../utils/typedKeys';
import './AwardsBlock.scss';

type AwardKey = 'silver' | 'gold' | 'platinum';

interface AwardsBlockProps {
  data: Awards;
}

function AwardsBlock(props: AwardsBlockProps) {
  const awards = props.data;
  const list = typedKeys(awards).filter(
    (x) => x !== 'count' && awards[x] > 0
  ) as AwardKey[];

  const breakdown = list.reduce(
    (p: string, k: AwardKey) => `${p}${awards[k]} ${k},`,
    `Post awarded `
  );

  const awardLabel =
    awards.count === 0
      ? 'Post not gilded'
      : `${breakdown} for a total of ${awards.count}.`;

  return (
    <div className="awards" aria-label={awardLabel}>
      {list.map((key: AwardKey) => (
        <div
          key={key}
          className={classNames('awards__gild', key)}
          title={`${awards[key]} ${key}`}
          aria-hidden={true}
        >
          <span className="awards__count">{awards[key]}</span>
        </div>
      ))}
    </div>
  );
}

export default React.memo(AwardsBlock);

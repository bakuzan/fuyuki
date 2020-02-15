import { GroupWithSubreddits } from 'src/interfaces/Group';

export default function applyGroupFilter(
  items: GroupWithSubreddits[],
  filter: string
) {
  if (!filter) {
    return items;
  }

  return items.reduce<GroupWithSubreddits[]>((p, g) => {
    const item: GroupWithSubreddits = {
      ...g,
      subreddits: g.subreddits.map((s) => ({
        ...s,
        isHidden: !s.name.includes(filter)
      }))
    };

    const groupMatches = item.name.includes(filter);
    const subMatches = item.subreddits.filter((x) => !x.isHidden).length > 0;

    return groupMatches || subMatches ? [...p, item] : p;
  }, []);
}

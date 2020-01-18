import { Group } from 'src/interfaces/Group';

export default function applyGroupFilter(items: Group[], filter: string) {
  if (!filter) {
    return items;
  }

  return items.reduce<Group[]>((p, g) => {
    const item: Group = {
      ...g,
      subreddits: g.subreddits.filter((s) => s.name.includes(filter))
    };

    const groupMatches = item.name.includes(filter);
    const subMatches = item.subreddits.length > 0;

    return groupMatches || subMatches ? [...p, item] : p;
  }, []);
}

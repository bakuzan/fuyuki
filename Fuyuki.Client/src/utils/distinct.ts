interface IdObject {
  id: string;
}

function defaultFilter<T extends IdObject>(item: T, index: number, arr: T[]) {
  return arr.findIndex((x) => x.id === item.id) === index;
}

export default function distinct<T extends IdObject>(
  arr: T[],
  filter = defaultFilter
) {
  return arr.filter(filter);
}

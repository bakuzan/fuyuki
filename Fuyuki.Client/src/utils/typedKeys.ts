export default function typedKeys<T>(o: T): (keyof T)[] {
  return Object.keys(o) as (keyof T)[];
}

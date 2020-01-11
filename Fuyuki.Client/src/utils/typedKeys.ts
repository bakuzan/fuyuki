export default function typedKeys<T>(o: T): Array<keyof T> {
  return Object.keys(o) as Array<keyof T>;
}

declare module 'classnames' {
  type ClassValue =
    | string
    | number
    | ClassDictionary
    | ClassArray
    | undefined
    | null
    | false;

  interface ClassDictionary {
    [id: string]: boolean | undefined | null;
  }

  interface ClassArray extends Array<ClassValue> {}

  interface ClassNamesFn {
    (...classes: ClassValue[]): string;
  }

  var classNames: ClassNamesFn;

  export = classNames;
}

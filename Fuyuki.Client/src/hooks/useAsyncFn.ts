/* tslint:disable:no-unused-expression */
import { DependencyList, useCallback, useRef, useState } from 'react';
import { useMountedState } from './useMountedState';

export type AsyncState<T> =
  | {
      loading: boolean;
      error?: undefined;
      value?: undefined;
    }
  | {
      loading: false;
      error: Error;
      value?: undefined;
    }
  | {
      loading: false;
      error?: undefined;
      value: T;
    };

export type AsyncFn<Result = any, Args extends any[] = any[]> = [
  AsyncState<Result>,
  (...args: Args | []) => Promise<Result>,
  () => void
];

export function useAsyncFn<Result = any, Args extends any[] = any[]>(
  fn: (...args: Args | []) => Promise<Result>,
  deps: DependencyList = [],
  initialState: AsyncState<Result> = { loading: false }
): AsyncFn<Result, Args> {
  const lastCallId = useRef(0);
  const [state, set] = useState<AsyncState<Result>>(initialState);

  const isMounted = useMountedState();
  const reset = () => set(initialState);
  const callback = useCallback((...args: Args | []) => {
    const callId = ++lastCallId.current;
    set(
      (p: AsyncState<Result>) =>
        ({ value: p.value, loading: true } as AsyncState<Result>)
    );

    return fn(...args).then(
      (value) => {
        isMounted() &&
          callId === lastCallId.current &&
          set({ value, loading: false });

        return value;
      },
      (error) => {
        isMounted() &&
          callId === lastCallId.current &&
          set({ error, loading: false });

        return error;
      }
    );
  }, deps);

  return [state, callback, reset];
}

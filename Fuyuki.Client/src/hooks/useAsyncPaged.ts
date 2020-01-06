import { useAsyncFn, AsyncState, AsyncFn } from 'src/hooks/useAsyncFn';
import sendRequest from 'src/utils/sendRequest';

export function useAsyncPaged<Result = any, Args extends any[] = any[]>(
  endpoint: string
): AsyncFn<Result, Args> {
  const [state, fetchPage] = useAsyncFn<Result, Args>(
    async (...params) => {
      const currentState: AsyncState<Result> = params[0];
      const lastPostId: string = params[1];

      const queryUrl = `${endpoint}/${lastPostId}`.replace(/\/\//, '/');
      const response = await sendRequest(queryUrl);

      if (response && !response.success) {
        // TODO is this okay?
        return response;
      }

      const pages =
        currentState.value instanceof Array ? currentState.value : [];

      const pagingReset = lastPostId === '' && pages.length;

      return pagingReset ? response : [...pages, ...response];
    },
    [endpoint],
    { loading: true }
  );

  return [
    state,
    (...args: Args | []) => {
      const callArgs = [state, ...args] as Args;
      return fetchPage(...callArgs);
    }
  ];
}

import { AsyncFn, AsyncState, useAsyncFn } from 'src/hooks/useAsyncFn';
import distinct from 'src/utils/distinct';
import sendRequest from 'src/utils/sendRequest';

function ensureValidUrl(endpoint: string, lastPostId: string) {
  const [query, search] = endpoint.split('?');
  return `${query}/${lastPostId}${search ? `?${search}` : ''}`.replace(
    /\/\//,
    '/'
  );
}

export function useAsyncPaged<Result = any, Args extends any[] = any[]>(
  endpoint: string
): AsyncFn<Result, Args> {
  const [state, fetchPage, resetState] = useAsyncFn<Result, Args>(
    async (...params) => {
      const currentState: AsyncState<Result> = params[0];
      const lastPostId: string = params[1] ?? '';

      const queryUrl = ensureValidUrl(endpoint, lastPostId);
      const response = await sendRequest(queryUrl);

      const isResponseArray = response instanceof Array;

      if (!isResponseArray) {
        // TODO
        // is this okay..?
        return response;
      }

      const pages =
        currentState.value instanceof Array ? currentState.value : [];

      const pagingReset = lastPostId === '' && pages.length;

      return pagingReset ? response : distinct([...pages, ...response]);
    },
    [endpoint],
    { loading: true }
  );

  return [
    state,
    (...args: Args | []) => {
      const callArgs = [state, ...args] as Args;
      return fetchPage(...callArgs);
    },
    resetState
  ];
}

import { AsyncState } from 'src/hooks/useAsyncFn';
import { FykResponse } from 'src/interfaces/ApiResponse';

export default function guardList<T = any>(
  state: AsyncState<T[]> | AsyncState<FykResponse<T[]>>
) {
  return state.value instanceof Array ? state.value : [];
}

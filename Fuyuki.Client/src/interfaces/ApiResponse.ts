export interface ApiResponse {
  success: boolean;
  error?: string | Error;
}

export type FykResponse<T> = T | ApiResponse;

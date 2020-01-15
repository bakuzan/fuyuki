import sendRequest from '../sendRequest';
import { RequestCache } from './RequestCache';

const CACHE_TIMEOUT = 1000 * 60 * 10; // 10 minutes
const cache = new RequestCache<string, any>(512);

class FetchError extends Error {
  status: number;

  constructor(url: string, status: number) {
    super(`${url} failed with status ${status}`);
    this.status = status;
  }
}

type ResponseBodyType = 'text' | 'json' | 'raw';

async function processResponse(response: Response, type: ResponseBodyType) {
  switch (type) {
    case 'text':
      return await response.text();
    case 'json':
      return await response.json();
    case 'raw':
      return response;
    default:
      throw new Error(`Invalid type: ${type}`);
  }
}

interface RequestContentInit extends RequestInit {
  type?: ResponseBodyType;
}

export default async function requestContent(
  url: string,
  opts: RequestContentInit
) {
  const { type = 'text', ...options } = opts;

  const cached = await cache.get(url, CACHE_TIMEOUT);
  if (cached) {
    return await processResponse(cached, type);
  }

  const response = await sendRequest(url, options);

  if (!response.ok) {
    throw new FetchError(url, response.status);
  }

  cache.set(url, response);

  return await processResponse(response, type);
}

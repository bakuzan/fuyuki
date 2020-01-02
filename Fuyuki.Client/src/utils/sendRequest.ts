import authService from '../components/ApiAuthorisation/AuthoriseService';

function uintToString(uintArray: Uint8Array | undefined) {
  const encodedString = String.fromCharCode.apply(
    null,
    Array.from(uintArray ?? [])
  );

  return decodeURIComponent(escape(encodedString));
}

export default async function sendRequest(
  url: string,
  options: RequestInit = {}
) {
  try {
    const token = await authService.getAccessToken();

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('pragma', 'no-cache');
    headers.append('cache-control', 'no-cache');
    headers.append('Content-Type', 'application/json');

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorResponse = await response.body?.getReader().read();
      const error = uintToString(errorResponse?.value) || `Request failed.`;

      console.log(error);
      return {
        success: false,
        error
      };
    }
    console.log(response);
    const result = await response.json();

    // TODO
    // Generic error display if result.success === false

    return result;
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
}

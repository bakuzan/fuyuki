import {
  ApplicationPaths,
  QueryParameterNames
} from 'src/components/ApiAuthorisation/ApiAuthorisationConstants';
import authService from '../components/ApiAuthorisation/AuthoriseService';

const UNAUTHOURISED_ERROR = 401;

function uintToString(uintArray: Uint8Array | undefined) {
  const encodedString = String.fromCharCode.apply(
    null,
    Array.from(uintArray ?? [])
  );

  return decodeURIComponent(escape(encodedString));
}

export default async function sendRequest(
  url: string,
  options: RequestInit = {},
  ignoreUnauthorised: boolean = false
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

      // Just force a signout if you get a 401...
      if (response.status === UNAUTHOURISED_ERROR && !ignoreUnauthorised) {
        const params = new URLSearchParams(window.location.search);
        let fromQuery = params.get(QueryParameterNames.ReturnUrl);

        if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
          fromQuery = '';
        }

        const returnUrl =
          fromQuery || `${window.location.origin}${ApplicationPaths.LoggedOut}`;

        await authService.signOut({ returnUrl });
      }

      return {
        error,
        success: false
      };
    }

    const result = await response.json();

    // TODO
    // Generic error display if result.success === false

    return result;
  } catch (error) {
    return { error, success: false };
  }
}

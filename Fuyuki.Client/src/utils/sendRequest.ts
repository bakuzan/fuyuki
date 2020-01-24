import {
  ApplicationPaths,
  QueryParameterNames
} from 'src/components/ApiAuthorisation/ApiAuthorisationConstants';
import authService from '../components/ApiAuthorisation/AuthoriseService';
import alertService from './alertService';

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
    const sameSite = !url.startsWith('http');
    const reqHeaders = options.headers ?? {};
    let authorisation = {};

    if (sameSite) {
      const token = await authService.getAccessToken();
      authorisation = { Authorization: `Bearer ${token}` };
    }

    const headers = {
      ...authorisation,
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      ...reqHeaders
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorResponse = await response.body?.getReader().read();
      const error = uintToString(errorResponse?.value) || `Request failed.`;
      const isUnauthorised = response.status === UNAUTHOURISED_ERROR;

      // Just force a signout if you get a 401...
      if (isUnauthorised && !ignoreUnauthorised) {
        const params = new URLSearchParams(window.location.search);
        let fromQuery = params.get(QueryParameterNames.ReturnUrl);

        if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
          fromQuery = '';
        }

        const returnUrl =
          fromQuery || `${window.location.origin}${ApplicationPaths.LoggedOut}`;

        await authService.signOut({ returnUrl });
      } else if (!isUnauthorised) {
        console.log('Bad response, Not 401', response);
        alertService.showError(
          `Request was unsuccessful.`,
          `${response.status}: ${response.statusText}`
        );
      }

      return {
        error,
        success: false
      };
    }

    return await response.json();
  } catch (error) {
    console.log('Request error', error);
    alertService.showError(`Request failed.`, error.message);

    return { error, success: false };
  }
}

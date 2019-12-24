import authService from '../components/ApiAuthorisation/AuthoriseService';

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

    const result = await response.json();

    // TODO
    // Generic error display if result.success === false

    return result;
  } catch (error) {
    return { success: false, error };
  }
}

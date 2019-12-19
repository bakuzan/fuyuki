import authService from '../components/ApiAuthorisation/AuthoriseService';

export default async function sendRequest(
  url: string,
  options: RequestInit = {}
) {
  try {
    const token = await authService.getAccessToken();

    const response = await fetch(url, {
      headers: !token ? {} : { Authorization: `Bearer ${token}` },
      ...options
    });

    const result = await response.json();

    // TODO
    // Generic error display if result.success === false

    return result;
  } catch (error) {
    return { success: false, error };
  }
}

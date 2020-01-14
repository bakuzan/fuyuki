import hasImageExtension from './hasImageExtension';

export default function getImageUrl(url: string) {
  if (hasImageExtension(url)) {
    return url;
  }

  if (url.includes('imgur')) {
    const directImage = url.replace('//', '//i.');
    return `${directImage}.jpg`;
  }

  // This shouldn't happen in theory...
  return url;
}

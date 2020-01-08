const imageDomains = ['imgur'];

export const hasImageExtension = (url: string) =>
  url.match(/\.(jpeg|jpg|gif|gifv|png|webp)$/) != null;

export default function isImageURL(url: string) {
  return (
    url && (hasImageExtension(url) || imageDomains.some((x) => url.includes(x)))
  );
}

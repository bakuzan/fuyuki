export default function hasImageExtension(rawUrl: string) {
  const url = rawUrl.split('?')[0];
  return url.match(/\.(jpeg|jpg|gif|gifv|png|webp)$/) != null;
}

export default function isImageURL(url: string) {
  return url && url.match(/\.(jpeg|jpg|gif|gifv|png|webp)$/) != null;
}

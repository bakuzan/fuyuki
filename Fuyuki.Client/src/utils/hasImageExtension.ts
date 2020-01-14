const hasImageExtension = (url: string) =>
  url.match(/\.(jpeg|jpg|gif|gifv|png|webp)$/) != null;

export default hasImageExtension;

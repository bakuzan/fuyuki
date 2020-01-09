const embedDomains = ['gfycat', 'twitch', 'youtu.be', 'v.redd.it'];

export default function isIframeContent(url: string) {
  return url && embedDomains.some((x) => url.includes(x));
}

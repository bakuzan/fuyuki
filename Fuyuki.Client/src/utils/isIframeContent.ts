const embedDomains = ['gfycat', 'twitch', 'youtu.be'];

export default function isIframeContent(url: string) {
  return url && embedDomains.some((x) => url.includes(x));
}

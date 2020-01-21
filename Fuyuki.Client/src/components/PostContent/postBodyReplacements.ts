export default function postBodyReplacements(html: string) {
  if (!html) {
    return html;
  }

  return html.replace('href="/u/', 'href="https://www.reddit.com/u/');
}

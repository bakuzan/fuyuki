export default function postBodyReplacements(html: string) {
  return html.replace('href="/u/', 'href="https://www.reddit.com/u/');
}

export default function htmlBodyReplacements(html: string) {
  if (!html) {
    return html;
  }

  const codeBlocks = html.match(/```([^```]*)```/g);
  if (codeBlocks) {
    codeBlocks.forEach((m) => {
      html = html.replace(m, `<code>${m.replace(/`/g, '')}</code>`);
    });
  }

  if (html.includes('<code>')) {
    html = html.replace(/<code>/g, '<div class="code-wrapper"><code>');
    html = html.replace(/<\/code>/g, '</code></div>');
  }

  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(html, 'text/html');

  const anchors = Array.from(htmlDoc.getElementsByTagName('a'));
  anchors.forEach((an) => {
    const href = an.getAttribute('href') ?? '';

    if (href.startsWith('/u/')) {
      html = html.replace(href, `https://www.reddit.com${href}`);
    } else if (href.startsWith('https://www.reddit.com/r/')) {
      const hasSearch = href.includes('?');
      const [_, search] = href.split('?');

      const [subname, comment, postId, __, commentId] = href
        .replace('https://www.reddit.com/r/', '')
        .split('/');

      const isPost = comment === 'comments';
      const isComment = commentId !== undefined;
      let preferredUrl = isPost
        ? `/post/t3_${postId}/comments`
        : `/r/${subname}`;

      preferredUrl += isComment ? `?commentId=${commentId}` : '';

      html = html.replace(href.replace(/&/g, '&amp;'), preferredUrl);

      if (hasSearch) {
        html = html.replace(`?${search}`, '');
      }
    }
  });

  return html;
}

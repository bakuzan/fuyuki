function detectIe() {
  const ua = window.navigator.userAgent;
  const msie = ua.indexOf('MSIE ');

  if (msie > 0) {
    // If Internet Explorer, return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  } // If another browser, return 0

  return false;
}

export default function scrollTo(opts: ScrollToOptions) {
  if (!detectIe()) {
    window.scrollTo(opts);
  } else {
    window.scrollTo(opts.left ?? 0, opts.top ?? 0);
  }
}

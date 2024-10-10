function parseStringtoHtml(iframePlayer: string) {
  const width = '100%';
  const height = '100%';

  const parser = new DOMParser();
  const parsedIframe = parser.parseFromString(iframePlayer, 'text/html').body
    .firstChild as HTMLIFrameElement;

  if (width && height) {
    parsedIframe?.setAttribute('width', width);
    parsedIframe?.setAttribute('height', height);
  }

  return parsedIframe?.outerHTML;
}

export default parseStringtoHtml;

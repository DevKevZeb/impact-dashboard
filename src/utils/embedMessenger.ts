export function initEmbedMessenger(): void {
  const params = new URLSearchParams(window.location.search);
  if (params.get('embed') !== 'true') return;
  const sendHeight = (): void => {
    const height: number = document.documentElement.scrollHeight;

    window.parent.postMessage(
      {
        type: 'pei-resize',
        height,
      },
      'https://pacificecommerce.org'
    );
  };

  sendHeight();

  const observer: MutationObserver = new MutationObserver(sendHeight);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });

  window.addEventListener('resize', sendHeight);
}
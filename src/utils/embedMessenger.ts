export function initEmbedMessenger(): void {
  const params = new URLSearchParams(window.location.search);

  if (params.get('embed') !== 'true') return;

  const allowedOrigins = [
    'https://pacificecommerce.org',
    'https://orchid-alligator-247477.hostingersite.com'
  ];

  const sendHeight = (): void => {
    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );

    allowedOrigins.forEach((origin) => {
      window.parent.postMessage(
        {
          type: 'pei-resize',
          height,
        },
        origin
      );
    });
  };

  sendHeight();

  const observer = new MutationObserver(() => {
    sendHeight();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });

  window.addEventListener('resize', sendHeight);
}
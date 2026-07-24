export function initEmbedMessenger(): void {
  const params = new URLSearchParams(window.location.search);

  if (params.get("embed") !== "true") return;

  document.body.classList.add("embed-mode");
  document.documentElement.classList.add("embed-mode");

  const allowedOrigins = [
    "https://orchid-alligator-247477.hostingersite.com",
    "https://wpw54b6v8n-staging.wpdns.site",
    "https://pacificecommerce.org"
  ];

  const broadcast = (height: number): void => {
    allowedOrigins.forEach((origin) => {
      window.parent.postMessage({ type: "pei-resize", height }, origin);
    });
  };

  const sendScrollTop = (): void => {
    allowedOrigins.forEach((origin) => {
      window.parent.postMessage({ type: "pei-scroll-top" }, origin);
    });
  };

  const sendHeight = (): void => {
    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
    );
    broadcast(height);
  };

  const sendReset = (): void => broadcast(100);

  const scheduleMeasurements = (): void => {
    [100, 300, 600, 1200, 2500].forEach((delay) => setTimeout(sendHeight, delay));
  };

  const patchHistoryMethod = (method: "pushState" | "replaceState"): void => {
    const original = history[method].bind(history);
    (history[method] as any) = (...args: Parameters<typeof history.pushState>) => {
      original(...args);
      sendScrollTop();
      sendReset();
      scheduleMeasurements();
    };
  };

  patchHistoryMethod("pushState");
  patchHistoryMethod("replaceState");

  window.addEventListener("popstate", () => {
    sendScrollTop();
    sendReset();
    scheduleMeasurements();
  });

  sendHeight();

  window.addEventListener("load", () => {
    [500, 1500, 3000].forEach((delay) => setTimeout(sendHeight, delay));
  });

  let mutationTimer: ReturnType<typeof setTimeout> | null = null;

  const observer = new MutationObserver(() => {
    if (mutationTimer) clearTimeout(mutationTimer);
    mutationTimer = setTimeout(sendHeight, 150);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
  });

  window.addEventListener("resize", sendHeight);
}
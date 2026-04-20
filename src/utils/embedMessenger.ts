export function initEmbedMessenger(): void {
  const params = new URLSearchParams(window.location.search);

  if (params.get("embed") !== "true") return;

  document.body.classList.add("embed-mode");
  document.documentElement.classList.add("embed-mode");

  const allowedOrigins = [
    "https://orchid-alligator-247477.hostingersite.com", 
    "https://pacificecommerce.org"
  ];

  const sendHeight = (): void => {
    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    
    allowedOrigins.forEach((origin) => {
      console.log("[EMBED] enviando a:", origin);

      window.parent.postMessage(
        {
          type: "pei-resize",
          height,
        },
        origin
      );
    });
  };

  sendHeight();

  window.addEventListener("load", () => {
    setTimeout(sendHeight, 500);
    setTimeout(sendHeight, 1500);
    setTimeout(sendHeight, 3000);
  });

  const observer = new MutationObserver(() => {
    sendHeight();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });

  // resize manual
  window.addEventListener("resize", sendHeight);
}
// Google Analytics, loaded only when VITE_GA_ID is set at build time.
// Leave it unset (for example on a preview or local build) to disable tracking.
export function initAnalytics() {
  const id = import.meta.env.VITE_GA_ID;
  if (!id) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}

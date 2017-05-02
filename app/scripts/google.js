(function loadGapi() {
  const head = document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = "https://apis.google.com/js/client.js?onload=initgapi";
  head.appendChild(script);
})();

window._gaq = window._gaq || [];
const _gaq = window._gaq;
_gaq.push(['_setAccount', 'UA-98363727-1']);
_gaq.push(['_setCustomVar', 1, 'DRSVersion', $DRS_VERSION, 3]);
_gaq.push(['_trackPageview']);

(function() {
  const ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://www.google-analytics.com/ga.js';
  const s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
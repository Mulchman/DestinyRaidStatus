(function() {
  console.log("DRS extension (id: " + chrome.runtime.id + "): content script 'destinyraidstatus' is loading.");

  if (!('BroadcastChannel' in self)) {
    console.warn("DRS extension (id: " + chrome.runtime.id + "): 'BroadcastChannel' is not available. Extension will not work.");
    return;
  }

  chrome.runtime.onMessage.addListener(function(event) {
    console.log("DRS extension (id: " + chrome.runtime.id + "): content script is relaying %o to the DRS page.", event);
    const channel = new BroadcastChannel('drs_in');
    channel.postMessage(event);
    channel.close();
  });
})();
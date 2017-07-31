(function() {
  // console.log("chrome.runtime.id: ", chrome.runtime.id);
  var appInfo = { id: -1, loaded: false, pending: null };

  // TODO: incognito is untested
  function openExtension() {
    if (chrome.extension.inIncognitoContext) {
      var appUrl = chrome.extension.getURL('index.html');
      chrome.tabs.create({ url: appUrl }, function(tab) {
        appInfo.id = tab.id;
      });
    } else {
      chrome.runtime.openOptionsPage();
    }
  }

  chrome.browserAction.onClicked.addListener(function() {
    openExtension();
  });

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if ((appInfo.id === -1) && (tab.url.indexOf(chrome.runtime.id) !== -1)) {
      appInfo.id = tab.id;
      // console.log("[DRS] found our tab: ", tab);
    }

    if ((appInfo.id !== -1) && !appInfo.loaded && (changeInfo.status === 'complete')) {
      appInfo.loaded = true;
      // console.log("[DRS] tab loaded! ", tab);
    }

    if ((appInfo.id !== -1) && appInfo.loaded && (appInfo.pending !== null)) {
      var lookup = { lookup: appInfo.pending.lookup };
      chrome.tabs.sendMessage(appInfo.id, lookup);
      appInfo.pending = null;
    }
  });

  chrome.tabs.onRemoved.addListener(function(tabId/* , removeInfo*/) {
    if (tabId === appInfo.id) {
      appInfo.id = -1;
      appInfo.loaded = false;
      appInfo.pending = null;
      // console.log("[DRS] tab removed!");
    }
  });

  chrome.runtime.onInstalled.addListener(function() {
    var title = "Destiny Raid Status";

    var parent = chrome.contextMenus.create({ title: title, id: "drs_parent", contexts: ["page", "selection"] });
    chrome.contextMenus.create({ title: "Select some text", parentId: parent, id: "drs_child1", contexts: ["page"], enabled: false });
    chrome.contextMenus.create({ title: "Lookup in DRS", parentId: parent, id: "drs_child2", contexts: ["selection"], onclick: function(info/* , tab*/) {
      if ((appInfo.id !== -1) && appInfo.loaded) {
        chrome.tabs.sendMessage(appInfo.id, { lookup: info.selectionText });
      } else {
        appInfo.pending = { lookup: info.selectionText };
        openExtension();
      }
    } });
  });
})();
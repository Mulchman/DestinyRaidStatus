(function() {
  console.log("DRS extension (id: " + chrome.runtime.id + "): background script is loading.");

  const appInfo = { id: chrome.runtime.id, loaded: false, pending: [], tabId: -1 };
  // const urlDrs = "https://127.0.0.1:8080/";
  const urlDrs = "https://destinyraidstatus.com/";
  const constants = {
    D1: 'D1',
    D2: 'D2',
    PSN: 'PSN',
    XBL: 'XBL'
  };

  function openDrsTab() {
    console.log("DRS extension (id: " + chrome.runtime.id + "): background script is creating the DRS tab.");
    chrome.tabs.create({ url: urlDrs });
  }

  function openOrFocusDrsTab() {
    if (appInfo.tabId === -1) {
      openDrsTab();
    } else {
      console.log("DRS extension (id: " + chrome.runtime.id + "): background script is focusing the DRS tab.");
      const updateProps = { active: true };
      chrome.tabs.update(appInfo.tabId, updateProps);
    }
  }

  function processPending() {
    if (appInfo.tabId === -1) {
      openDrsTab();
    } else {
      // relay information to content script
      for (let i = 0; i < appInfo.pending.length; i++) {
        console.log("DRS extension (id: " + chrome.runtime.id + "): background script is sending %o to the content script.", appInfo.pending[i]);
        chrome.tabs.sendMessage(appInfo.tabId, appInfo.pending[i]);
      }
      appInfo.pending = [];
    }
  }

  function lookup(game, platform, text) {
    const lookup = { game: game, platform: platform, lookup: text };
    appInfo.pending.push(lookup);
    processPending();
  }

  chrome.browserAction.onClicked.addListener(function() {
    openOrFocusDrsTab();
  });

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if ((appInfo.tabId === -1) && (tab.url.indexOf(urlDrs) !== -1)) {
      console.log("DRS extension (id: " + chrome.runtime.id + "): background script found the DRS tab.");
      appInfo.tabId = tab.id;
    }

    if ((appInfo.tabId !== -1) && !appInfo.loaded && (changeInfo.status === 'complete')) {
      console.log("DRS extension (id: " + chrome.runtime.id + "): background script can now process context menu actions.");
      appInfo.loaded = true;
      processPending();
    }
  });

  chrome.tabs.onRemoved.addListener(function(tabId) {
    if (tabId === appInfo.tabId) {
      appInfo.tabId = -1;
      appInfo.loaded = false;
      appInfo.pending = [];
      console.log("DRS extension (id: " + chrome.runtime.id + "): background script releases the DRS tab.");
    }
  });

  chrome.runtime.onInstalled.addListener(function() {
    console.log("DRS extension (id: " + chrome.runtime.id + "): background script is registering context menu items.");

    const title = "Destiny Raid Status";
    const parent = chrome.contextMenus.create({ title: title, id: "drs_parent", contexts: ["selection"] });
    chrome.contextMenus.create({
      title: "Lookup in DRS (D1 - PSN)",
      parentId: parent,
      id: "drs_child_d1_1",
      contexts: ["selection"]
    });
    chrome.contextMenus.create({
      title: "Lookup in DRS (D1 - XBL)",
      parentId: parent,
      id: "drs_child_d1_2",
      contexts: ["selection"]
    });
    chrome.contextMenus.create({
      title: "Lookup in DRS (D2)",
      parentId: parent,
      id: "drs_child_d2_1",
      contexts: ["selection"]
    });

    chrome.tabs.query({}, function(tabs) {
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        if ((typeof tab.url !== 'undefined') && (tab.url.indexOf(urlDrs) !== -1)) {
          console.log("DRS extension (id: " + chrome.runtime.id + "): background script found the existing DRS tab. It needs to be refreshed for the extension to work correctly. Background script will attempt to do this now.");
          chrome.tabs.reload(tab.id);
        }
      }
    });
  });

  chrome.contextMenus.onClicked.addListener(function(event) {
    switch (event.menuItemId) {
    case 'drs_child_d1_1':
      lookup(constants.D1, constants.PSN, event.selectionText);
      break;
    case 'drs_child_d1_2':
      lookup(constants.D1, constants.XBL, event.selectionText);
      break;
    case 'drs_child_d2_1':
      lookup(constants.D2, '', event.selectionText);
      break;
    }
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    lookup(request.game, request.platform, request.lookup);
    sendResponse();
  });
})();
(function() {
  console.log("DRS extension (id: " + chrome.runtime.id + "): content script 'destinylfg' is loading.");

  const attributeDrs = "drs-name";
  const attributeChatStyle = "display: inline-block; padding: 0 7px; position: relative; font-size: 13px; left: 4px;";
  const getTitle = (name) => ("Lookup '" + name + "' in DRS");
  const iconSrc = chrome.extension.getURL('icon16.png');
  const intervalMs = 3000;
  const sentinelList = "drs-sentinel-list";
  const sentinelChat = "drs-sentinel-chat";
  const xpathList = "//*[contains(@class, 'gamertag-block')]";
  const xpathListName = ".//*[contains(@class, 'gamertag')]";
  const xpathChat = "//*[contains(@class, 'tab') and ./@data-gamertag]";

  function handleClick() {
    const name = this.getAttribute(attributeDrs);
    console.log("DRS extension (id: " + chrome.runtime.id + "): DRS lookup %o...", name);
    chrome.runtime.sendMessage({ game: 'D2', platform: '', lookup: name });
  }

  function createDrsElement(name, isChat) {
    const element = isChat
      ? document.createElement('span')
      : document.createElement('a');

    element.title = getTitle(name);
    element.onclick = handleClick;
    element.setAttribute(attributeDrs, name);

    if (isChat) {
      element.className = sentinelChat;
      element.setAttribute('style', attributeChatStyle);
    } else {
      element.className = sentinelList + ' icon-link';
      element.href = "javascript:void(0)";
    }

    const img = document.createElement('img');
    img.src = iconSrc;

    element.appendChild(img);
    return element;
  }

  function getElementsByXPath(path) {
    const retval = [];

    const elements = document.evaluate(path, document, null, XPathResult.ANY_TYPE, null);
    let iterator = elements.iterateNext();
    while (iterator) {
      retval.push(iterator);
      iterator = elements.iterateNext();
    }

    return retval;
  }

  function getNameFromListElement(element) {
    const path = xpathListName;
    const result = document.evaluate(path, element, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const name = result.singleNodeValue ? result.singleNodeValue.textContent.trim() : null;

    return name;
  }

  function getNameFromChatElement(element) {
    const name = element.getAttribute('data-gamertag');
    return name;
  }

  function elementHasSentinel(element, sentinel) {
    return element.classList.contains(sentinel);
  }

  function runLoopList() {
    let count = 0;
    const gamertags = getElementsByXPath(xpathList);
    for (let i = 0; i < gamertags.length; i++) {
      const gamertag = gamertags[i];

      if (elementHasSentinel(gamertag, sentinelList)) {
        continue;
      }

      const name = getNameFromListElement(gamertag);
      if (name) {
        const drsElement = createDrsElement(name, false);
        gamertag.appendChild(drsElement);
        gamertag.classList.add(sentinelList);

        count += 1;
      }
    }

    return count;
  }

  function runLoopChat() {
    let count = 0;
    const gamertags = getElementsByXPath(xpathChat);
    for (let i = 0; i < gamertags.length; i++) {
      const gamertag = gamertags[i];

      if (elementHasSentinel(gamertag, sentinelChat)) {
        continue;
      }

      const name = getNameFromChatElement(gamertag);
      if (name) {
        const drsElement = createDrsElement(name, true);

        const subElement = gamertag.firstElementChild;
        subElement.insertBefore(drsElement, subElement.children[1]);

        gamertag.classList.add(sentinelChat);
        count += 1;
      }
    }

    return count;
  }

  function runLoop() {
    let count = 0;
    count += runLoopList();
    count += runLoopChat();

    if (count > 0) {
      console.log("DRS extension (id: " + chrome.runtime.id + "): Added %o element(s).", count);
    }
  }

  runLoop();
  setInterval(runLoop, intervalMs);
})();
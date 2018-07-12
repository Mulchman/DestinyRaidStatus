(function() {
  console.log("DRS extension (id: " + chrome.runtime.id + "): content script 'the100.io' is loading.");

  const attributeDrs = "drs-name";
  const getTitle = (name) => ("Lookup '" + name + "' in DRS");
  const iconSrc = chrome.extension.getURL('icon16.png');
  // const intervalMs = 3000;
  const prefix = "https://www.the100.io";
  const sentinelTitle = "drs-sentinel-title";
  const sentinelPlayer = "drs-sentinel-player";
  const xpathTitle = "//*[contains(@class, 'game-title')]";
  const xpathTitleChild = ".//*[contains(@class, 'issue-item-text')]";
  // const xpathPlayer = "//*[contains(@class, 'confirmed-session')]";

  function handleClick(event) {
    event.preventDefault();

    const name = this.getAttribute(attributeDrs);
    console.log("DRS extension (id: " + chrome.runtime.id + "): DRS lookup %o...", name);
    chrome.runtime.sendMessage({ game: 'D2', platform: '', lookup: name });
  }

  function createDrsElement(name, isPlayer) {
    const element = isPlayer
      ? document.createElement('a')
      : document.createElement('span');

    element.title = getTitle(name);
    element.onclick = handleClick;
    element.setAttribute(attributeDrs, name);

    if (isPlayer) {
      element.className = sentinelPlayer + ' drs-player';
      element.href = "javascript:void(0)";
    } else {
      element.className = sentinelTitle + ' drs-title';
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

  function getSingleChildElementByXPath(element, path) {
    const result = document.evaluate(path, element, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue ? result.singleNodeValue : null;
  }

  function elementHasSentinel(element, sentinel) {
    return element.classList.contains(sentinel);
  }

  const titles = getElementsByXPath(xpathTitle);
  for (let i = 0; i < titles.length; i++) {
    const title = titles[i];

    if (elementHasSentinel(title, sentinelTitle)) {
      continue;
    }

    const name = title.getAttribute('href');
    if (name) {
      const child = getSingleChildElementByXPath(title, xpathTitleChild);
      if (child) {
        const drsElement = createDrsElement(prefix + name, false);
        child.appendChild(drsElement);
        title.classList.add(sentinelTitle);
      }
    }
  }

  /*
  const players = getElementsByXPath(xpathPlayer);
  for (let i = 0; i < players.length; i++) {
    const player = players[i];

    if (elementHasSentinel(player, sentinelPlayer)) {
      continue;
    }

    console.log("[DRS] player: %o", player);

    const name = "test"
    if (name) {
      const drsElement = createDrsElement(name, true);
      player.appendChild(drsElement);
      player.classList.add(sentinelPlayer);
    }
  }
  */
})();
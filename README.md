# DestinyRaidStatus
Easily check raid status of Destiny player(s)

## Developer quick start
Clone the repository:

* `git clone https://github.com/Mulchman/DestinyRaidStatus.git`

Install dependencies:

* Install [NodeJS].
* Run `npm install`
* Windows-based developers need to install `windows-build-tools` (`npm install --global windows-build-tools`) globally prior to running `npm install`.

Check code Style
* `npm run lint`

Build in dev mode (Chrome extension)
* `npm start`. This will bundle and copy all the assets, as well as watch for changes. You can now run locally by enabling [Chrome Extensions Developer Mode](https://developer.chrome.com/extensions/faq#faq-dev-01) and point to the `dist` folder.
* If you want to test the the100.io integration you need to allow CORS. Add `"*://*/*"` to the `manifest.json` `permissions` and reload (through the Chrome extensions page) the extension.

Get your own API key:

* Goto [Bungie](https://www.bungie.net/en/Application)
* Open your extension in another tab, copy the url up to `/index.html`.
* Paste your extension url into the `Origin Header` section on bungie.net
* Create a file named `apiKey.json` in the root of the DRS directory tree that looks like the following (including the curly braces and quotations): `{ "apiKey": "paste_here" }`
* Copy your API-key from bungie.net into the section where it says `paste_here`. Re-build and you're good to go.

Special thanks to DIM and its awesome developers- the `ActionQueue`, Bungie network response `switch`ing, `webpack` config, `settings`, and some other misc. bits were borrowed and adapted from DIM.

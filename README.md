# DestinyRaidStatus
Easily check raid status of Destiny player(s)

## Developer quick start
Clone the repository:

* `git clone https://github.com/Mulchman/DestinyRaidStatus.git`

Install dependencies:

* Install [NodeJS].
* Windows-based developers need to install `windows-build-tools` (`npm install --global windows-build-tools`) globally prior to running `npm install`.
* Run `npm install`
* Windows-based developers need to install `openssl` manually and/or add it to the path. Try [this](https://www.cloudinsidr.com/content/how-to-install-the-most-recent-version-of-openssl-on-windows-10-in-64-bit/).
* If you want to be able to test locally, run `npm install --global spa-http-server`.

Check code style:
* `npm run lint`

Development on a locally run web server:
* Building:
  * `npm run build-dev -- --watch`. This will bundle and copy all the assets, as well as watch for changes.
* Generating `openssl` stuff:
  * Open a command prompt in the `dist` subdirectory.
    * Windows-based developers:
      * `openssl genrsa -out key.pem 1024`
      * `openssl req -new -key key.pem -out key.csr`. Accept all the defaults.
      * `openssl x509 -req -days 365 -in key.csr -signkey key.pem -out cert.pem`
    * Non Windows-based developers-
      * ??? use openssl to create key.pem and cert.pem ???
* Running the local web server:
  * Open a command prompt in the `dist` subdirectory and run `http-server --push-state -S`

Chrome extension:
* This gets 'built' when `npm run build-dev` is run. Point Chrome (`Load Unpacked`) at the `dist/chrome-extension` directory. The Chrome extension offers a context menu that can facilitate in getting names to [Destiny Raid Status](https://destinyraidstatus.com) quicker and without the need to copy/paste. The Chrome extension also adds a DRS icon next to player names on destinylfg.net to make looking up players quicker and without the need for copy/paste or selecting text.

Get your own API key:

* Goto [Bungie](https://www.bungie.net/en/Application)
* Open your extension in another tab, copy the url up to `/index.html`.
* Paste your extension url into the `Origin Header` section on bungie.net
* Create a file named `apiKey.json` in the root of the DRS directory tree that looks like the following (including the curly braces and quotations): `{ "apiKey": "paste_here" }`
* Copy your API-key from bungie.net into the section where it says `paste_here`. Re-build and you're good to go.

Special thanks to DIM and its awesome developers- the `ActionQueue`, Bungie network response `switch`ing, `webpack` config, `settings`, and some other misc. bits were borrowed and adapted from DIM.

# 2.1.0

* Removed the ability to run the whole application as an extension. The extension features will simply hook/call in to the web version.
* Updated [README.md](https://github.com/Mulchman/DestinyRaidStatus/blob/master/README.md) with instructions on how to host the web version locally for development purposes.
* Created a Chrome extension that adds some DRS related context menu entries when you select text on any web page. This lets you look up players by simply highlighting their name on any web page, right clicking, and selecting the platform-specific context menu action. A DRS tab will open (if one isn't already opened) and queue the lookup. The Chrome extension also adds a DRS icon next to player names on destinylfg.net to aid in looking up players without having to copy/paste or select any text.
* Added a copy icon next to player names to easily copy said name to the clipboard.

# 2.0.1

* Style fixes for small screens.

# 2.0.0

* Destiny 2 support.

# 1.0.7

* Update Destiny API endpoints due to Bungie changes.
* Fix rate limiting regex but disable altogether in the meantime.
* Fix path to fonts after 1.0.6 re-org.

# 1.0.6

* Add rate limiting to Bungie.net queries.
* Internal reorganization.

# 1.0.5

* Add in visual grouping to the the100.io games. Also display error messages in certain cases so it doesn't appear like nothing happened.

# 1.0.4

* Remove '#!' from addresses on the web version (HTML5 mode) for #11. (Chrome extension version still has the '#'.)
* Fix #11 - Allow linking to players directly. Specify the platform ('psn' or 'xbl') then a list of players:
* Example #1: https://destinyraidstatus.com/psn/username1
* Example #2: https://destinyraidstatus.com/psn/username1/username2/etc.
* Example #3: https://destinyraidstatus.com/xbl/username1/username2/username3/username4/etc.
* Fix #8 - scrape the100.io games. the100.io game URLs can be entered in the PSN/Gamertag search box.
* Example #1: paste the full URL to a the100.io game in the search box. Player list will auto-populate with players from that game.
* Example #2: or link to the app with a the100.io game id: https://destinyraidstatus.com/api/the100/<gameId>

# 1.0.3 - https

* Moved everything behind https.

# 1.0.3

* Fix #2 - Persist platform toggle.
* Fix #5 - All strings now pulled from language files. Just need translations.
* Fix #9 - Use 'PSN Id' or 'Gamertag' depending on the platform.
* Replace platform toggle with something better/simpler.
* Slim down platform/raid services and move their constant values to a single file.
* Switch 'PS4' to 'PSN', 'XB1' to 'XBL'
* Add [TRANSLATIONS.md](https://github.com/Mulchman/DestinyRaidStatus/blob/master/TRANSLATIONS.md) to help guide translators as to where/what/how to translate.

# 1.0.2

* Fix #6 - make tab say 'Destiny Raid Status' instead of 'DRS'.
* Fix #7 - account for deleted characters.
* Fix #1 - add link to Destiny Status and Destiny Tracker for each gamertag.
* Fix #4 - swap VoG and CE.
* Semi-fix #3 - add some @media queries
* Fixes to gamertag input (empty, whitespace).
* Fix Chrome extension version number differing from website.
* Add 'otherwise' route back to index.
* NOTE: Bungie's raid counter (Grimoire raid card) doesn't show 390 LL raids currently (in case you're wondering why numbers look different compared to Bungie.net).

# 1.0.1

* Add changelog and version number to the footer.

# 1.0.0

* Fix 390 raid completions missing non-featured variants.
* Change version number to indicate a public release.

# 0.0.1

* Initial release.

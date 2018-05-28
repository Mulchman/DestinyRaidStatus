const constants = {
  games: ['D1', 'D2'],
  isExtension: window.chrome && window.chrome.extension,
  platforms: ['PSN', 'XBL', 'PC'],
  platformsLookup: { 1: 'XBL', 2: 'PSN', 4: 'PC' }, // match names in platforms
  raids: [
    // Crota's End- nm/hm/non-featured 390/featured 390/
    1836893116, 1836893119, 2324706853, 4000873610,
    // Vault of Glass- nm/hm/390
    2659248071, 2659248068, 4038697181, 856898338,
    // Kings Fall- nm/hm/390
    1733556769, 3534581229, 1016659723, 3978884648,
    // Wrath of the Machine- nm/hm/390
    260765522, 1387993552, 430160982, 3356249023
  ],
  raidsD2: [
    // Leviathan - normal
    2693136605, 2693136604, 2693136602, 2693136603, 2693136600, 2693136601,
    // Leviathan - normal but through guided games
    89727599, 287649202, 1699948563, 1875726950, 3916343513, 4039317196,
    // Leviathan - prestige
    1685065161, 757116822, 417231112, 3446541099, 2449714930,	3879860661,
    // Eater of Worlds - normal
    3089205900,
    // Eater of Worlds - normal but through guided games
    2164432138,
    // Eater of Worlds - prestige
    809170886,
    // Spire of Stars - normal
    119944200,
    // Spire of Stars - normal but through guided games
    3004605630,
    // Spire of Stars - prestige
    3213556450
  ]
};

export default constants;
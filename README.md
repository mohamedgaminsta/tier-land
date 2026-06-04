# TierLands Rankings Website

Double-click `run.bat` on Windows to open the site with local save support.
You can still open `index.html` directly, but browser security may block direct admin saving.

Admin data manager: open `adminsecretplacenoneknow/index.html`, or visit `/adminsecretplacenoneknow/` after publishing to your domain.
If your host opens `/adminsecretplacenoneknow` without the final slash, the admin page redirects to the slash URL so the login scripts load correctly.
Default admin login is in `adminsecretplacenoneknow/admin-users.js`.

```text
username: admin
password: changeme
```

Change that file to add users and set permissions for `players`, `modes`, and `save`.

Note: the published static site can show the admin editor, but it cannot write changes back into GitHub by itself. The Save button will download a fresh `players-data.js` unless you add a real backend API.

## Editing Players

Edit `players-data.js` to add or change players.

Change region colors globally in `window.TIERLANDS_REGIONS`. Player points and combat titles are calculated automatically from tiers.

Example:

```js
{
  name: "PlayerName",
  title: "Combat Master",
  points: 295,
  region: "EU",
  tiers: {
    overall: "",
    vanilla: "HT1",
    sword: "LT1",
    mace: "HT3",
    axe: "LT2",
    pot: "LT1"
  }
}
```

Valid tiers:

```text
HT1, LT1, HT2, LT2, HT3, LT3, HT4, LT4, HT5, LT5
```

Tier points:

```text
HT1 70, LT1 60, HT2 55, LT2 50, HT3 40, LT3 35, HT4 25, LT4 20, HT5 10, LT5 5
```

Combat titles:

```text
Combat Grandmaster 400+, Combat Master 250+, Combat Ace 100+, Combat Specialist 50+, Combat Cadet 20+, Combat Novice 10+, Rookie 0-9
```

Current game modes:

```text
overall, vanilla, uhc, pot, nethop, smp, sword, axe, mace
```

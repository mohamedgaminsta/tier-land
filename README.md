# TierLands Rankings Website

Double-click `run.bat` on Windows to open the site with local save support.
You can still open `index.html` directly, but browser security may block direct admin saving.

Admin data manager: open `adminsecretplacenoneknow/index.html`, or visit `/adminsecretplacenoneknow/` after publishing to your domain.
Default admin login is in `adminsecretplacenoneknow/admin-users.js`.

```text
username: admin
password: changeme
```

Change that file to add users and set permissions for `players`, `modes`, and `save`.

## Editing Players

Edit `players-data.js` to add or change players.

Change region colors globally in `window.TIERLANDS_REGIONS`.

Example:

```js
{
  name: "PlayerName",
  title: "Combat Master",
  points: 250,
  region: "EU",
  regionColor: "",
  regionTextColor: "",
  tiers: {
    overall: "HT2",
    sword: "LT1",
    mace: "HT3"
  }
}
```

To give one player a custom region badge color:

```js
region: "NA",
regionColor: "#662735",
regionTextColor: "#ff7183",
```

Valid tiers:

```text
HT1, LT1, HT2, LT2, HT3, LT3, HT4, LT4, HT5, LT5
```

Current game modes:

```text
overall, vanilla, uhc, pot, nethop, smp, sword, axe, mace
```

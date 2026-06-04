const fallbackModes = [
  { id: "overall", name: "Overall", icon: "TL", iconPath: "", color: "#ffc857" },
  { id: "vanilla", name: "Vanilla", icon: "V", iconPath: "../images/Vanilla.webp", color: "#caa6ff" },
  { id: "uhc", name: "UHC", icon: "H", iconPath: "../images/UHC.webp", color: "#ff6878" },
  { id: "pot", name: "Pot", icon: "P", iconPath: "../images/Pot.webp", color: "#f6f3ff" },
  { id: "nethop", name: "NethOP", icon: "N", iconPath: "../images/NethOP.webp", color: "#a47be8" },
  { id: "smp", name: "SMP", icon: "S", iconPath: "../images/SMP.webp", color: "#18d3a1" },
  { id: "sword", name: "Sword", icon: "SW", iconPath: "../images/Sword.webp", color: "#6aa7ff" },
  { id: "axe", name: "Axe", icon: "A", iconPath: "../images/Axe.webp", color: "#78c8ff" },
  { id: "mace", name: "Mace", icon: "M", iconPath: "../images/Mace.webp", color: "#969dc3" }
];

const tierOptions = ["", "HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5"];
const iconByMode = {
  vanilla: "../images/Vanilla.webp",
  uhc: "../images/UHC.webp",
  pot: "../images/Pot.webp",
  nethop: "../images/NethOP.webp",
  smp: "../images/SMP.webp",
  sword: "../images/Sword.webp",
  axe: "../images/Axe.webp",
  mace: "../images/Mace.webp"
};

const sourceModes = Array.isArray(window.TIERLANDS_MODES) && window.TIERLANDS_MODES.length
  ? window.TIERLANDS_MODES
  : fallbackModes;

const state = {
  modes: sourceModes.map(normalizeMode),
  regions: cloneJSON(window.TIERLANDS_REGIONS || {}),
  players: cloneJSON(Array.isArray(window.TIERLANDS_PLAYERS) ? window.TIERLANDS_PLAYERS : []),
  selectedIndex: 0,
  search: "",
  currentUser: null
};

const playerList = document.querySelector("#adminPlayerList");
const modeList = document.querySelector("#adminModeList");
const tierInputs = document.querySelector("#tierInputs");
const jsonOutput = document.querySelector("#jsonOutput");
const editorTitle = document.querySelector("#editorTitle");
const searchInput = document.querySelector("#adminSearchInput");
const addPlayerButton = document.querySelector("#addPlayerButton");
const removePlayerButton = document.querySelector("#removePlayerButton");
const addModeButton = document.querySelector("#addModeButton");
const saveButtons = [document.querySelector("#saveDataButton"), document.querySelector("#saveDataButtonBottom")];
const previewDataButton = document.querySelector("#previewDataButton");
const saveStatus = document.querySelector("#saveStatus");
const loginPanel = document.querySelector("#loginPanel");
const loginForm = document.querySelector("#loginForm");
const loginUsernameInput = document.querySelector("#loginUsernameInput");
const loginPasswordInput = document.querySelector("#loginPasswordInput");
const loginStatus = document.querySelector("#loginStatus");
const logoutButton = document.querySelector("#logoutButton");
const adminUserBadge = document.querySelector("#adminUserBadge");
const adminShell = document.querySelector(".admin-shell");
const sessionUserKey = "tierlands-admin-user";

const fields = {
  name: document.querySelector("#playerNameInput"),
  title: document.querySelector("#playerTitleInput"),
  points: document.querySelector("#playerPointsInput"),
  region: document.querySelector("#playerRegionInput"),
  regionColor: document.querySelector("#playerRegionColorInput"),
  regionTextColor: document.querySelector("#playerRegionTextColorInput")
};

function cloneJSON(value) {
  return JSON.parse(JSON.stringify(value));
}

function getUsers() {
  return Array.isArray(window.TIERLANDS_ADMIN_USERS) ? window.TIERLANDS_ADMIN_USERS : [];
}

function readSessionUser() {
  try {
    return sessionStorage.getItem(sessionUserKey);
  } catch (error) {
    return "";
  }
}

function writeSessionUser(username) {
  try {
    if (username) {
      sessionStorage.setItem(sessionUserKey, username);
    } else {
      sessionStorage.removeItem(sessionUserKey);
    }
  } catch (error) {
    // Some local-file or privacy-mode browser sessions block sessionStorage.
    // Login should still unlock the page for the current tab.
  }
}

function normalizePermissions(permissions) {
  return {
    players: Boolean(permissions && permissions.players),
    modes: Boolean(permissions && permissions.modes),
    save: Boolean(permissions && permissions.save)
  };
}

function hasPermission(permission) {
  return Boolean(state.currentUser && state.currentUser.permissions[permission]);
}

function setStatus(message, tone = "") {
  if (!saveStatus) return;
  saveStatus.textContent = message;
  saveStatus.dataset.tone = tone;
}

function setLoggedInUser(user) {
  state.currentUser = user
    ? {
        username: user.username,
        permissions: normalizePermissions(user.permissions)
      }
    : null;

  if (state.currentUser) {
    writeSessionUser(state.currentUser.username);
  } else {
    writeSessionUser("");
  }

  applyAuthState();
}

function restoreSession() {
  const username = readSessionUser();
  if (!username) {
    applyAuthState();
    return;
  }

  const user = getUsers().find((entry) => entry.username === username);
  state.currentUser = user
    ? {
        username: user.username,
        permissions: normalizePermissions(user.permissions)
      }
    : null;
  applyAuthState();
}

function applyAuthState() {
  const signedIn = Boolean(state.currentUser);
  document.body.classList.toggle("admin-locked", !signedIn);
  if (loginPanel) loginPanel.hidden = signedIn;
  if (logoutButton) logoutButton.hidden = !signedIn;
  if (adminUserBadge) {
    adminUserBadge.hidden = !signedIn;
    adminUserBadge.textContent = signedIn ? state.currentUser.username : "";
  }

  if (adminShell) {
    adminShell.querySelectorAll("main > section:not(.admin-login-panel)").forEach((section) => {
      section.hidden = !signedIn;
    });
  }

  render();
}

function normalizeMode(mode) {
  const id = slugify(mode.id || mode.name || "mode");
  return {
    id,
    name: mode.name || id,
    icon: mode.icon || (mode.name || id).slice(0, 2).toUpperCase(),
    iconPath: normalizeIconPath(mode.iconPath || iconByMode[id] || ""),
    color: mode.color || "#6aa7ff"
  };
}

function normalizeIconPath(path) {
  if (!path) return "";
  return path.startsWith("../") ? path : `../${path}`;
}

function outputIconPath(path) {
  return path.startsWith("../") ? path.slice(3) : path;
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "mode";
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function selectedPlayer() {
  return state.players[state.selectedIndex] || null;
}

function getModeIcon(mode) {
  if (!mode.iconPath) return `<strong>${escapeHTML(mode.icon || "?")}</strong>`;
  return `<img src="${escapeHTML(mode.iconPath)}" alt="">`;
}

function setDisabledWithin(root, disabled) {
  if (!root) return;
  root.querySelectorAll("input, select, button, textarea").forEach((control) => {
    control.disabled = disabled;
  });
}

function ensurePlayerTiers(player) {
  player.tiers = player.tiers || {};
  state.modes.forEach((mode) => {
    if (!Object.prototype.hasOwnProperty.call(player.tiers, mode.id)) {
      player.tiers[mode.id] = "";
    }
  });
}

function renderPlayers() {
  if (!playerList) return;
  const filtered = state.players
    .map((player, index) => ({ player, index }))
    .filter(({ player }) => String(player.name || "").toLowerCase().includes(state.search.toLowerCase()));

  playerList.innerHTML = filtered.map(({ player, index }) => `
    <button class="admin-player-card${index === state.selectedIndex ? " active" : ""}" type="button" data-index="${index}">
      <span>${escapeHTML(player.name || `Player ${index + 1}`)}</span>
      <b>${Number(player.points || 0)} pts</b>
      <i>${escapeHTML(player.region || "??")}</i>
    </button>
  `).join("") || `<div class="empty-state">No players found.</div>`;
}

function renderEditor() {
  const player = selectedPlayer();
  const disabled = !player || !hasPermission("players");
  Object.values(fields).forEach((field) => {
    field.disabled = disabled;
  });
  if (removePlayerButton) removePlayerButton.disabled = disabled;
  if (addPlayerButton) addPlayerButton.disabled = !hasPermission("players");

  if (!player) {
    if (editorTitle) editorTitle.textContent = "Select Player";
    if (tierInputs) tierInputs.innerHTML = "";
    return;
  }

  ensurePlayerTiers(player);
  if (editorTitle) editorTitle.textContent = player.name || `Player ${state.selectedIndex + 1}`;
  fields.name.value = player.name || "";
  fields.title.value = player.title || "";
  fields.points.value = Number(player.points || 0);
  fields.region.value = player.region || "";
  fields.regionColor.value = player.regionColor || "#263244";
  fields.regionTextColor.value = player.regionTextColor || "#d9e5f4";

  if (!tierInputs) return;
  tierInputs.innerHTML = state.modes.map((mode) => `
    <label class="admin-tier-field">
      <span class="admin-mode-icon" style="--mode-color: ${escapeHTML(mode.color)}">${getModeIcon(mode)}</span>
      <b>${escapeHTML(mode.name)}</b>
      <select data-tier-mode="${escapeHTML(mode.id)}"${!hasPermission("players") ? " disabled" : ""}>
        ${tierOptions.map((tier) => `<option value="${tier}"${(player.tiers[mode.id] || "") === tier ? " selected" : ""}>${tier || "Unranked"}</option>`).join("")}
      </select>
    </label>
  `).join("");
}

function renderModes() {
  if (!modeList) return;
  modeList.innerHTML = state.modes.map((mode, index) => `
    <article class="admin-mode-row" data-index="${index}">
      <span class="admin-mode-icon" style="--mode-color: ${escapeHTML(mode.color)}">${getModeIcon(mode)}</span>
      <label>
        <span>Name</span>
        <input data-mode-field="name" value="${escapeHTML(mode.name)}"${!hasPermission("modes") ? " disabled" : ""}>
      </label>
      <label>
        <span>ID</span>
        <input data-mode-field="id" value="${escapeHTML(mode.id)}"${mode.id === "overall" || !hasPermission("modes") ? " disabled" : ""}>
      </label>
      <label>
        <span>Icon path</span>
        <input data-mode-field="iconPath" value="${escapeHTML(mode.iconPath)}"${!hasPermission("modes") ? " disabled" : ""}>
      </label>
      <label>
        <span>Color</span>
        <input data-mode-field="color" type="color" value="${escapeHTML(mode.color)}"${!hasPermission("modes") ? " disabled" : ""}>
      </label>
      <button class="admin-danger" data-remove-mode="${index}" type="button"${mode.id === "overall" || !hasPermission("modes") ? " disabled" : ""}>Remove</button>
    </article>
  `).join("");
  if (addModeButton) addModeButton.disabled = !hasPermission("modes");
}

function getCleanData() {
  const modes = state.modes.map((mode) => ({
    id: mode.id,
    name: mode.name,
    icon: mode.icon,
    iconPath: outputIconPath(mode.iconPath),
    color: mode.color
  }));

  const players = state.players.map((player) => {
    const tiers = {};
    state.modes.forEach((mode) => {
      tiers[mode.id] = player.tiers && player.tiers[mode.id] ? player.tiers[mode.id] : "";
    });

    return {
      name: player.name || "",
      title: player.title || "",
      points: Number(player.points || 0),
      region: player.region || "",
      regionColor: player.regionColor || "",
      regionTextColor: player.regionTextColor || "",
      tiers
    };
  });

  return {
    regions: state.regions,
    modes,
    players
  };
}

function renderJson() {
  if (!jsonOutput) return;
  jsonOutput.value = JSON.stringify(getCleanData(), null, 2);
  saveButtons.forEach((button) => {
    if (button) button.disabled = !hasPermission("save");
  });
}

function createPlayersDataFile() {
  const data = getCleanData();
  return `/*
  Edit this file to manage the leaderboard.

  Regions can be anything short, such as NA, EU, AS, SA, AU, ME, or AF.
  You can change region colors in TIERLANDS_REGIONS below.
  You can also override one player's badge with regionColor and regionTextColor.
  Tiers should use: HT1, LT1, HT2, LT2, HT3, LT3, HT4, LT4, HT5, LT5.
  Leave a mode blank with "" if the player does not have a tier there.
*/

window.TIERLANDS_REGIONS = ${JSON.stringify(data.regions, null, 2)};

window.TIERLANDS_MODES = ${JSON.stringify(data.modes, null, 2)};

window.TIERLANDS_PLAYERS = ${JSON.stringify(data.players, null, 2)};
`;
}

async function saveWithLocalServer(content) {
  const response = await fetch("../api/save", {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: content
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
}

async function saveWithFilePicker(content) {
  if (!window.showSaveFilePicker) return false;

  const handle = await window.showSaveFilePicker({
    suggestedName: "players-data.js",
    types: [
      {
        description: "JavaScript data file",
        accept: { "text/javascript": [".js"] }
      }
    ]
  });
  const writable = await handle.createWritable();
  await writable.write(content);
  await writable.close();
  return true;
}

function downloadPlayersData(content) {
  const blob = new Blob([content], { type: "text/javascript" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "players-data.js";
  link.click();
  URL.revokeObjectURL(link.href);
}

async function saveData() {
  if (!hasPermission("save")) {
    setStatus("This username does not have save permission.", "error");
    return;
  }

  const content = createPlayersDataFile();
  setStatus("Saving players-data.js...", "");

  try {
    await saveWithLocalServer(content);
    setStatus("Saved. Opening rankings...", "success");
    window.location.href = "../index.html";
  } catch (serverError) {
    try {
      const saved = await saveWithFilePicker(content);
      if (saved) {
        setStatus("Saved. Opening rankings...", "success");
        window.location.href = "../index.html";
        return;
      }
    } catch (pickerError) {
      if (pickerError && pickerError.name === "AbortError") {
        setStatus("Save cancelled.", "error");
        return;
      }
    }

    downloadPlayersData(content);
    setStatus("Browser blocked direct file writing. A fresh players-data.js was downloaded instead.", "error");
  }
}

function render() {
  renderPlayers();
  renderEditor();
  renderModes();
  renderJson();
}

function updatePlayerField(key, value) {
  if (!hasPermission("players")) return;
  const player = selectedPlayer();
  if (!player) return;
  player[key] = key === "points" ? Number(value || 0) : value;
  renderPlayers();
  renderJson();
  if (key === "name") editorTitle.textContent = value || `Player ${state.selectedIndex + 1}`;
}

playerList.addEventListener("click", (event) => {
  const card = event.target.closest("[data-index]");
  if (!card) return;
  state.selectedIndex = Number(card.dataset.index);
  render();
});

Object.entries(fields).forEach(([key, field]) => {
  field.addEventListener("input", () => updatePlayerField(key, field.value));
});

tierInputs.addEventListener("change", (event) => {
  if (!hasPermission("players")) return;
  const select = event.target.closest("[data-tier-mode]");
  const player = selectedPlayer();
  if (!select || !player) return;
  ensurePlayerTiers(player);
  player.tiers[select.dataset.tierMode] = select.value;
  renderJson();
});

searchInput.addEventListener("input", () => {
  state.search = searchInput.value.trim();
  renderPlayers();
});

addPlayerButton.addEventListener("click", () => {
  if (!hasPermission("players")) return;
  const player = {
    name: `NewPlayer${state.players.length + 1}`,
    title: "Ranked Player",
    points: 0,
    region: "NA",
    regionColor: "",
    regionTextColor: "",
    tiers: {}
  };
  ensurePlayerTiers(player);
  state.players.push(player);
  state.selectedIndex = state.players.length - 1;
  render();
});

removePlayerButton.addEventListener("click", () => {
  if (!hasPermission("players")) return;
  if (!selectedPlayer()) return;
  state.players.splice(state.selectedIndex, 1);
  state.selectedIndex = Math.max(0, state.selectedIndex - 1);
  render();
});

addModeButton.addEventListener("click", () => {
  if (!hasPermission("modes")) return;
  const id = `mode-${state.modes.length}`;
  state.modes.push({ id, name: "New Mode", icon: "NM", iconPath: "", color: "#6aa7ff" });
  state.players.forEach((player) => {
    ensurePlayerTiers(player);
    player.tiers[id] = "";
  });
  render();
});

modeList.addEventListener("change", (event) => {
  if (!hasPermission("modes")) return;
  const row = event.target.closest("[data-index]");
  const field = event.target.dataset.modeField;
  if (!row || !field) return;
  const mode = state.modes[Number(row.dataset.index)];
  const previousId = mode.id;
  mode[field] = field === "id" ? slugify(event.target.value) : event.target.value;
  if (field === "iconPath") mode.iconPath = normalizeIconPath(mode.iconPath);
  if (field === "name" && !mode.icon) mode.icon = mode.name.slice(0, 2).toUpperCase();
  if (field === "id" && previousId !== mode.id) {
    state.players.forEach((player) => {
      player.tiers = player.tiers || {};
      player.tiers[mode.id] = player.tiers[previousId] || "";
      delete player.tiers[previousId];
    });
  }
  render();
});

modeList.addEventListener("click", (event) => {
  if (!hasPermission("modes")) return;
  const button = event.target.closest("[data-remove-mode]");
  if (!button) return;
  const index = Number(button.dataset.removeMode);
  const [removed] = state.modes.splice(index, 1);
  state.players.forEach((player) => {
    if (player.tiers) delete player.tiers[removed.id];
  });
  render();
});

saveButtons.forEach((button) => {
  if (!button) return;
  button.addEventListener("click", saveData);
});

previewDataButton.addEventListener("click", () => {
  jsonOutput.hidden = !jsonOutput.hidden;
  previewDataButton.textContent = jsonOutput.hidden ? "Preview Data" : "Hide Preview";
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = loginUsernameInput.value.trim();
  const password = loginPasswordInput.value;
  const user = getUsers().find((entry) => entry.username === username && entry.password === password);

  if (!user) {
    loginStatus.textContent = "Wrong username or password.";
    return;
  }

  loginStatus.textContent = "";
  loginPasswordInput.value = "";
  setLoggedInUser(user);
});

logoutButton.addEventListener("click", () => {
  setLoggedInUser(null);
  if (loginUsernameInput) loginUsernameInput.focus();
});

restoreSession();

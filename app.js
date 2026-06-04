const defaultModes = [
  { id: "overall", name: "Overall", icon: "TL", iconPath: "", color: "#ffc857" },
  { id: "vanilla", name: "Vanilla", icon: "V", iconPath: "images/Vanilla.webp", color: "#caa6ff" },
  { id: "uhc", name: "UHC", icon: "H", iconPath: "images/UHC.webp", color: "#ff6878" },
  { id: "pot", name: "Pot", icon: "P", iconPath: "images/Pot.webp", color: "#f6f3ff" },
  { id: "nethop", name: "NethOP", icon: "N", iconPath: "images/NethOP.webp", color: "#a47be8" },
  { id: "smp", name: "SMP", icon: "S", iconPath: "images/SMP.webp", color: "#18d3a1" },
  { id: "sword", name: "Sword", icon: "SW", iconPath: "images/Sword.webp", color: "#6aa7ff" },
  { id: "axe", name: "Axe", icon: "A", iconPath: "images/Axe.webp", color: "#78c8ff" },
  { id: "mace", name: "Mace", icon: "M", iconPath: "images/Mace.webp", color: "#969dc3" }
];

const modes = Array.isArray(window.TIERLANDS_MODES) && window.TIERLANDS_MODES.length
  ? window.TIERLANDS_MODES
  : defaultModes;

const tierScore = {
  HT1: 70,
  LT1: 60,
  HT2: 55,
  LT2: 50,
  HT3: 40,
  LT3: 35,
  HT4: 25,
  LT4: 20,
  HT5: 10,
  LT5: 5
};

const titleRanks = [
  { min: 400, title: "Combat Grandmaster" },
  { min: 250, title: "Combat Master" },
  { min: 100, title: "Combat Ace" },
  { min: 50, title: "Combat Specialist" },
  { min: 20, title: "Combat Cadet" },
  { min: 10, title: "Combat Novice" },
  { min: 0, title: "Rookie" }
];

const tierClass = {
  HT1: "tier-gold",
  LT1: "tier-amber",
  HT2: "tier-blue",
  LT2: "tier-slate",
  HT3: "tier-orange",
  LT3: "tier-copper",
  HT4: "tier-violet",
  LT4: "tier-purple",
  HT5: "tier-red",
  LT5: "tier-muted"
};

const regionClass = {
  NA: "region-na",
  EU: "region-eu",
  AS: "region-as",
  SA: "region-sa",
  AU: "region-au",
  ME: "region-me",
  AF: "region-af"
};

const regionColors = window.TIERLANDS_REGIONS || {};

let activeMode = localStorage.getItem("tierlands-active-mode") || "overall";
let searchTerm = "";

if (!modes.some((mode) => mode.id === activeMode)) {
  activeMode = "overall";
  localStorage.setItem("tierlands-active-mode", activeMode);
}

const players = Array.isArray(window.TIERLANDS_PLAYERS) ? window.TIERLANDS_PLAYERS : [];
const modeTabs = document.querySelector("#modeTabs");
const playerList = document.querySelector("#playerList");
const rankingTitle = document.querySelector("#rankingTitle");
const activeModeLabel = document.querySelector("#activeModeLabel");
const searchInput = document.querySelector("#searchInput");
const infoButton = document.querySelector("#infoButton");
const creditsButton = document.querySelector("#creditsButton");
const infoDialog = document.querySelector("#infoDialog");
const creditsDialog = document.querySelector("#creditsDialog");

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getMode(modeId) {
  return modes.find((mode) => mode.id === modeId) || modes[0];
}

function renderModeIcon(mode) {
  const fallback = escapeHTML(mode.icon || mode.name.charAt(0) || "?");
  if (!mode.iconPath) return fallback;
  return `<img src="${escapeHTML(mode.iconPath)}" alt="" loading="lazy">`;
}

function getPlayerName(player, index) {
  const name = String(player.name || "").trim();
  return name || `Player ${index + 1}`;
}

function getPlayerModeTier(player, modeId) {
  return player.tiers && player.tiers[modeId] ? player.tiers[modeId] : "";
}

function getRegionStyle(player) {
  const defaults = regionColors[player.region] || {};
  const background = defaults.background || "#263244";
  const text = defaults.text || "#d9e5f4";
  return `background: ${background}; color: ${text};`;
}

function getPlayerTotalPoints(player) {
  return modes
    .filter((mode) => mode.id !== "overall")
    .reduce((total, mode) => total + (tierScore[getPlayerModeTier(player, mode.id)] || 0), 0);
}

function getPlayerTitle(player) {
  const points = getPlayerTotalPoints(player);
  return titleRanks.find((rank) => points >= rank.min).title;
}

function getPlayerScore(player, modeId) {
  if (modeId === "overall") {
    return getPlayerTotalPoints(player);
  }

  return tierScore[getPlayerModeTier(player, modeId)] || 0;
}

function getVisiblePlayers() {
  return players
    .filter((player, index) => getPlayerName(player, index).toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((player) => activeMode === "overall" || getPlayerModeTier(player, activeMode))
    .sort((a, b) => {
      const scoreDelta = getPlayerScore(b, activeMode) - getPlayerScore(a, activeMode);
      if (scoreDelta !== 0) return scoreDelta;
      return getPlayerTotalPoints(b) - getPlayerTotalPoints(a);
    });
}

function renderModeTabs() {
  if (!modeTabs) return;
  modeTabs.innerHTML = "";

  modes.forEach((mode) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `mode-tab${mode.id === activeMode ? " active" : ""}`;
    button.style.setProperty("--mode-color", mode.color);
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(mode.id === activeMode));
    button.dataset.label = `${mode.name} Rankings`;
    button.innerHTML = `<span>${renderModeIcon(mode)}</span><strong>${escapeHTML(mode.name)}</strong>`;
    button.addEventListener("click", () => {
      activeMode = mode.id;
      localStorage.setItem("tierlands-active-mode", activeMode);
      render();
    });
    modeTabs.appendChild(button);
  });
}

function renderPlayers() {
  if (!playerList) return;
  const visiblePlayers = getVisiblePlayers();
  playerList.innerHTML = "";

  if (visiblePlayers.length === 0) {
    playerList.innerHTML = `<div class="empty-state">No players found for this search or mode.</div>`;
    return;
  }

  visiblePlayers.forEach((player, index) => {
    const modeTier = getPlayerModeTier(player, activeMode);
    const playerName = getPlayerName(player, index);
    const points = getPlayerTotalPoints(player);
    const row = document.createElement("article");
    row.className = "player-row";
    row.dataset.playerName = playerName.toLowerCase();
    row.innerHTML = `
      <div class="rank-cell">
        <span class="rank-number">${index + 1}.</span>
      </div>
      <div class="player-cell">
        <strong>${escapeHTML(playerName)}</strong>
        <span>${escapeHTML(getPlayerTitle(player))} (${points} points)</span>
      </div>
      <div class="region-cell">
        <span class="region-badge ${regionClass[player.region] || "region-default"}" style="${getRegionStyle(player)}">${escapeHTML(player.region || "??")}</span>
      </div>
      <div class="tiers-cell">
        ${renderTierBadges(player, modeTier)}
      </div>
    `;
    playerList.appendChild(row);
  });
}

function renderTierBadges(player, modeTier) {
  if (activeMode !== "overall") {
    return modeTier ? renderTierBadge(getMode(activeMode), modeTier) : `<span class="no-tier">Unranked</span>`;
  }

  return modes
    .filter((mode) => mode.id !== "overall")
    .map((mode) => {
      const tier = getPlayerModeTier(player, mode.id);
      return tier ? renderTierBadge(mode, tier) : "";
    })
    .join("");
}

function renderTierBadge(mode, tier) {
  const label = `${mode.name} ${tier}`;
  return `
    <span class="tier-badge ${tierClass[tier] || "tier-muted"}" title="${label}" data-label="${escapeHTML(label)}">
      <i style="--mode-color: ${mode.color}">${renderModeIcon(mode)}</i>
      <b>${tier}</b>
    </span>
  `;
}

function render() {
  const mode = getMode(activeMode);
  if (activeModeLabel) activeModeLabel.textContent = mode.name;
  if (rankingTitle) rankingTitle.textContent = `${mode.name} Rankings`;
  renderModeTabs();
  renderPlayers();
}

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    searchTerm = event.target.value.trim();
    renderPlayers();
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const firstPlayer = playerList ? playerList.querySelector(".player-row") : null;
    if (!firstPlayer) return;
    firstPlayer.scrollIntoView({ behavior: "smooth", block: "center" });
    firstPlayer.classList.remove("spotlight");
    requestAnimationFrame(() => {
      firstPlayer.classList.add("spotlight");
      setTimeout(() => firstPlayer.classList.remove("spotlight"), 1600);
    });
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && searchInput && document.activeElement !== searchInput) {
    event.preventDefault();
    searchInput.focus();
  }
});

if (infoButton && infoDialog) {
  infoButton.addEventListener("click", () => infoDialog.showModal());
}

if (creditsButton && creditsDialog) {
  creditsButton.addEventListener("click", () => creditsDialog.showModal());
}

render();

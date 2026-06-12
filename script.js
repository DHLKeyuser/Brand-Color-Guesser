/* Logo Color Guess — game logic (vanilla JS) */

// Brand data: name + local SVG path + official brand HEX color.
// Logos and colors sourced from Simple Icons (CC0 1.0). See README.md.
const BRANDS = [
  { name: "Spotify", file: "assets/logos/spotify.svg", hex: "#1ED760" },
  { name: "Netflix", file: "assets/logos/netflix.svg", hex: "#E50914" },
  { name: "YouTube", file: "assets/logos/youtube.svg", hex: "#FF0000" },
  { name: "Instagram", file: "assets/logos/instagram.svg", hex: "#FF0069" },
  { name: "WhatsApp", file: "assets/logos/whatsapp.svg", hex: "#25D366" },
  { name: "Twitch", file: "assets/logos/twitch.svg", hex: "#9146FF" },
  { name: "Discord", file: "assets/logos/discord.svg", hex: "#5865F2" },
  { name: "Reddit", file: "assets/logos/reddit.svg", hex: "#FF4500" },
  { name: "Snapchat", file: "assets/logos/snapchat.svg", hex: "#FFFC00" },
  { name: "Android", file: "assets/logos/android.svg", hex: "#3DDC84" },
  { name: "NVIDIA", file: "assets/logos/nvidia.svg", hex: "#76B900" },
  { name: "Pinterest", file: "assets/logos/pinterest.svg", hex: "#BD081C" },
  { name: "Dropbox", file: "assets/logos/dropbox.svg", hex: "#0061FF" },
  { name: "Stripe", file: "assets/logos/stripe.svg", hex: "#635BFF" },
  { name: "Shopify", file: "assets/logos/shopify.svg", hex: "#7AB55C" },
  { name: "Airbnb", file: "assets/logos/airbnb.svg", hex: "#FF5A5F" },
  { name: "Lyft", file: "assets/logos/lyft.svg", hex: "#FF00BF" },
  { name: "Coca-Cola", file: "assets/logos/cocacola.svg", hex: "#D00013" },
  { name: "Starbucks", file: "assets/logos/starbucks.svg", hex: "#006241" },
  { name: "MasterCard", file: "assets/logos/mastercard.svg", hex: "#EB001B" },
  { name: "PayPal", file: "assets/logos/paypal.svg", hex: "#002991" },
  { name: "Intel", file: "assets/logos/intel.svg", hex: "#0071C5" },
  { name: "Ferrari", file: "assets/logos/ferrari.svg", hex: "#D40000" },
  { name: "BMW", file: "assets/logos/bmw.svg", hex: "#0066B1" },
  { name: "Google", file: "assets/logos/google.svg", hex: "#4285F4" },
  { name: "Firefox", file: "assets/logos/firefoxbrowser.svg", hex: "#FF7139" },
  { name: "Telegram", file: "assets/logos/telegram.svg", hex: "#26A5E4" },
  { name: "Signal", file: "assets/logos/signal.svg", hex: "#3B45FD" },
  { name: "Mastodon", file: "assets/logos/mastodon.svg", hex: "#6364FF" },
  { name: "Bluesky", file: "assets/logos/bluesky.svg", hex: "#1185FE" },
  { name: "SoundCloud", file: "assets/logos/soundcloud.svg", hex: "#FF5500" },
  { name: "WordPress", file: "assets/logos/wordpress.svg", hex: "#21759B" },
  { name: "Trello", file: "assets/logos/trello.svg", hex: "#0052CC" },
  { name: "Figma", file: "assets/logos/figma.svg", hex: "#F24E1E" },
  { name: "Dribbble", file: "assets/logos/dribbble.svg", hex: "#EA4C89" },
  { name: "Docker", file: "assets/logos/docker.svg", hex: "#2496ED" },
  { name: "Kubernetes", file: "assets/logos/kubernetes.svg", hex: "#326CE5" },
  { name: "MongoDB", file: "assets/logos/mongodb.svg", hex: "#47A248" },
  { name: "Python", file: "assets/logos/python.svg", hex: "#3776AB" },
  { name: "JavaScript", file: "assets/logos/javascript.svg", hex: "#F7DF1E" },
  { name: "React", file: "assets/logos/react.svg", hex: "#61DAFB" },
  { name: "Vue.js", file: "assets/logos/vuedotjs.svg", hex: "#4FC08D" },
  { name: "HTML5", file: "assets/logos/html5.svg", hex: "#E34F26" },
  { name: "GitLab", file: "assets/logos/gitlab.svg", hex: "#FC6D26" },
  { name: "Visa", file: "assets/logos/visa.svg", hex: "#1A1F71" },
];

const ROUNDS = 10;
const MAX_PER_ROUND = 10;
const MAX_TOTAL = ROUNDS * MAX_PER_ROUND;
const BEST_KEY = "logoColorGuess.best";

// --- DOM refs ---
const $ = (id) => document.getElementById(id);
const els = {
  gameView: $("gameView"),
  finalView: $("finalView"),
  bestScore: $("bestScore"),
  roundNow: $("roundNow"),
  roundTotal: $("roundTotal"),
  totalScore: $("totalScore"),
  progressFill: $("progressFill"),
  stage: $("logoStage"),
  stageSpinner: $("stageSpinner"),
  brandName: $("brandName"),
  guessPanel: $("guessPanel"),
  resultPanel: $("resultPanel"),
  colorPicker: $("colorPicker"),
  hexInput: $("hexInput"),
  guessBtn: $("guessBtn"),
  nextBtn: $("nextBtn"),
  roundScoreNum: $("roundScoreNum"),
  scoreCaption: $("scoreCaption"),
  yourSwatch: $("yourSwatch"),
  yourHex: $("yourHex"),
  origSwatch: $("origSwatch"),
  origHex: $("origHex"),
  scoreBadge: $("scoreBadge"),
  // final
  finalRank: $("finalRank"),
  finalTitle: $("finalTitle"),
  finalRounds: $("finalRounds"),
  finalScore: $("finalScore"),
  finalMax: $("finalMax"),
  finalBest: $("finalBest"),
  finalAccuracy: $("finalAccuracy"),
  newBestTag: $("newBestTag"),
  playAgainBtn: $("playAgainBtn"),
  shareBtn: $("shareBtn"),
  toast: $("toast"),
};

let state = {
  deck: [],
  round: 0,
  totalScore: 0,
};

// --- Color helpers ---
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function normalizeHex(raw) {
  let h = String(raw).trim().replace(/^#/, "").toUpperCase();
  if (/^[0-9A-F]{3}$/.test(h)) {
    h = h.split("").map((c) => c + c).join("");
  }
  if (/^[0-9A-F]{6}$/.test(h)) return "#" + h;
  return null;
}

// Perceptual "redmean" color distance — closer to how humans perceive
// color difference than plain RGB Euclidean distance.
function colorDistance(a, b) {
  const c1 = hexToRgb(a);
  const c2 = hexToRgb(b);
  const rMean = (c1.r + c2.r) / 2;
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt(
    (2 + rMean / 256) * dr * dr +
    4 * dg * dg +
    (2 + (255 - rMean) / 256) * db * db
  );
}
const MAX_DISTANCE = 764.8336; // black vs white under redmean

function scoreFromDistance(guess, correct) {
  const ratio = 1 - colorDistance(guess, correct) / MAX_DISTANCE;
  return Math.max(0, Math.min(MAX_PER_ROUND, Math.round(ratio * MAX_PER_ROUND)));
}

function captionFor(score) {
  if (score >= 10) return "Perfect match!";
  if (score >= 8) return "So close!";
  if (score >= 6) return "Pretty good.";
  if (score >= 4) return "Not bad.";
  if (score >= 2) return "Way off…";
  return "Different planet!";
}

function scoreColor(score) {
  if (score >= 7) return "var(--good)";
  if (score >= 4) return "var(--warn)";
  return "var(--bad)";
}

// --- Storage ---
function getBest() {
  const v = parseInt(localStorage.getItem(BEST_KEY) || "0", 10);
  return Number.isFinite(v) ? v : 0;
}
function setBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch (e) { /* ignore */ }
}

// --- Utilities ---
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let toastTimer;
function toast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 1800);
}

// --- Logo loading (inline SVG so we can recolor it) ---
const svgCache = {};
async function loadLogo(brand) {
  els.stage.innerHTML = "";
  els.stage.appendChild(els.stageSpinner);
  els.stage.classList.remove("revealed");
  els.stage.style.setProperty("--logo-fill", "#f3f5ff");

  let markup = svgCache[brand.file];
  if (!markup) {
    try {
      const res = await fetch(brand.file);
      markup = await res.text();
      svgCache[brand.file] = markup;
    } catch (e) {
      markup = "";
    }
  }

  if (markup) {
    els.stage.innerHTML = markup;
    const svg = els.stage.querySelector("svg");
    if (svg) {
      svg.removeAttribute("fill");
      svg.querySelectorAll("path").forEach((p) => p.removeAttribute("fill"));
    }
  } else {
    els.stage.textContent = brand.name;
  }
}

// --- Round flow ---
function startGame() {
  state.deck = shuffle(BRANDS).slice(0, ROUNDS);
  state.round = 0;
  state.totalScore = 0;

  els.finalView.hidden = true;
  els.gameView.hidden = false;
  els.roundTotal.textContent = ROUNDS;
  els.totalScore.textContent = "0";
  els.bestScore.textContent = getBest() || "–";

  loadRound();
}

function loadRound() {
  const brand = state.deck[state.round];

  els.guessPanel.hidden = false;
  els.resultPanel.hidden = true;
  els.guessPanel.classList.add("fade-in");

  els.roundNow.textContent = state.round + 1;
  els.progressFill.style.width = ((state.round) / ROUNDS) * 100 + "%";
  els.brandName.textContent = brand.name;

  loadLogo(brand);
  // start each round from a neutral mid color
  applyColor("#808080");
  els.guessBtn.disabled = false;
}

function applyColor(hex) {
  const norm = normalizeHex(hex);
  if (!norm) return;
  els.colorPicker.value = norm.toLowerCase();
  els.hexInput.value = norm.replace("#", "");
}

function submitGuess() {
  const norm = normalizeHex(els.hexInput.value);
  if (!norm) {
    toast("Enter a valid HEX color");
    els.hexInput.focus();
    return;
  }
  const brand = state.deck[state.round];
  const score = scoreFromDistance(norm, brand.hex);
  state.totalScore += score;

  // Reveal logo in its true color
  els.stage.style.setProperty("--logo-fill", brand.hex);
  els.stage.classList.add("revealed");

  // Fill result panel
  els.roundScoreNum.textContent = score;
  els.roundScoreNum.style.color = scoreColor(score);
  els.scoreCaption.textContent = captionFor(score);
  els.yourSwatch.style.background = norm;
  els.yourHex.textContent = norm;
  els.origSwatch.style.background = brand.hex;
  els.origHex.textContent = brand.hex;

  els.totalScore.textContent = state.totalScore;
  els.progressFill.style.width = ((state.round + 1) / ROUNDS) * 100 + "%";

  els.nextBtn.textContent = state.round + 1 >= ROUNDS ? "See results" : "Next logo";

  els.guessPanel.hidden = true;
  els.resultPanel.hidden = false;
  els.resultPanel.classList.remove("fade-in");
  void els.resultPanel.offsetWidth;
  els.resultPanel.classList.add("fade-in");
}

function nextRound() {
  state.round++;
  if (state.round >= ROUNDS) {
    endGame();
  } else {
    loadRound();
  }
}

function endGame() {
  const best = getBest();
  const isBest = state.totalScore > best;
  if (isBest) setBest(state.totalScore);

  const accuracy = Math.round((state.totalScore / MAX_TOTAL) * 100);

  const rank = rankFor(accuracy);
  els.finalRounds.textContent = ROUNDS;
  els.finalScore.textContent = state.totalScore;
  els.finalMax.textContent = MAX_TOTAL;
  els.finalBest.textContent = getBest();
  els.finalAccuracy.textContent = accuracy + "%";
  els.finalRank.textContent = rank.glyph;
  els.finalTitle.textContent = rank.title;
  els.newBestTag.hidden = !isBest;
  els.bestScore.textContent = getBest();

  els.gameView.hidden = true;
  els.finalView.hidden = false;
  els.finalView.classList.add("fade-in");
}

function rankFor(acc) {
  if (acc >= 90) return { glyph: "★", title: "Color master" };
  if (acc >= 75) return { glyph: "◆", title: "Sharp eye" };
  if (acc >= 50) return { glyph: "●", title: "Getting there" };
  return { glyph: "○", title: "Keep practicing" };
}

// --- Share ---
async function shareResult() {
  const acc = Math.round((state.totalScore / MAX_TOTAL) * 100);
  const text =
    `Logo Color Guess\n` +
    `Score: ${state.totalScore}/${MAX_TOTAL} (${acc}% accuracy)\n` +
    `Best: ${getBest()}/${MAX_TOTAL}\n` +
    `Can you guess brand colors better than me?`;

  try {
    if (navigator.share) {
      await navigator.share({ title: "Logo Color Guess", text });
      return;
    }
  } catch (e) { /* user cancelled or unsupported — fall through to copy */ }

  try {
    await navigator.clipboard.writeText(text);
    toast("Result copied to clipboard!");
  } catch (e) {
    // Fallback for older browsers / insecure contexts
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); toast("Result copied!"); }
    catch (err) { toast("Copy not supported"); }
    document.body.removeChild(ta);
  }
}

// --- Events ---
els.colorPicker.addEventListener("input", (e) => {
  els.hexInput.value = e.target.value.replace("#", "").toUpperCase();
});
els.hexInput.addEventListener("input", (e) => {
  const norm = normalizeHex(e.target.value);
  if (norm) els.colorPicker.value = norm.toLowerCase();
});
els.hexInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitGuess();
});
els.guessBtn.addEventListener("click", submitGuess);
els.nextBtn.addEventListener("click", nextRound);
els.playAgainBtn.addEventListener("click", startGame);
els.shareBtn.addEventListener("click", shareResult);

// --- Init ---
els.bestScore.textContent = getBest() || "–";
startGame();

// One-off build helper: copies curated Simple Icons SVGs into assets/logos/
// and prints the brand data array (name, file, hex) used by script.js.
// Simple Icons is CC0 1.0 (public domain). See README.md for attribution.
const fs = require("fs");
const path = require("path");
const si = require("simple-icons");

// Curated, recognizable brands with distinctive (non-black) logo colors.
const SLUGS = [
  "siSpotify", "siNetflix", "siYoutube", "siInstagram", "siWhatsapp",
  "siTwitch", "siDiscord", "siReddit", "siSnapchat", "siAndroid",
  "siNvidia", "siPinterest", "siDropbox", "siSlack", "siStripe",
  "siShopify", "siAirbnb", "siLyft", "siCocacola", "siStarbucks",
  "siMastercard", "siPaypal", "siIntel", "siFerrari", "siBmw",
  "siGoogle", "siFirefoxbrowser", "siTelegram", "siSignal", "siMastodon",
  "siBluesky", "siSoundcloud", "siWordpress", "siTrello", "siFigma",
  "siDribbble", "siDocker", "siKubernetes", "siMongodb", "siPython",
  "siJavascript", "siReact", "siVuedotjs", "siAngular", "siHtml5",
  "siGitlab", "siVisa", "siHeroku",
];

const outDir = path.join(__dirname, "..", "assets", "logos");
fs.mkdirSync(outDir, { recursive: true });

const brands = [];
for (const key of SLUGS) {
  const icon = si[key];
  if (!icon) {
    console.error("MISSING:", key);
    continue;
  }
  const file = icon.slug + ".svg";
  fs.writeFileSync(path.join(outDir, file), icon.svg, "utf8");
  brands.push({ name: icon.title, file: "assets/logos/" + file, hex: "#" + icon.hex });
}

console.log(JSON.stringify(brands, null, 2));
console.error("Wrote " + brands.length + " logos to " + outDir);

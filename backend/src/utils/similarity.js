
const disallowedPrefixes = ["official", "national", "central", "ministry of", "department of", "prime minister", "president", "certified", "authorized"];
const disallowedSuffixes = ["gov", "govt", "india", "bharat", "authority", "board", "commission", "scheme", "yojana", "portal" ];
const disallowedWords = ["criminal", "terrorist", "traitor", "fraudster", "scammer", "corrupt", "rapist", "molester", "anti-national", "extremist"];
const periodicities = ["daily", "weekly", "monthly", "fortnightly", "evening", "morning"];

function normalizeTitle(title) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 ]/gi, "");
}

function hasDisallowedPrefix(title) {
  return disallowedPrefixes.some((prefix) =>
    title.toLowerCase().startsWith(prefix.toLowerCase() + " ")
  );
}

function hasDisallowedSuffix(title) {
  return disallowedSuffixes.some((suffix) =>
    title.toLowerCase().endsWith(" " + suffix.toLowerCase())
  );
}

function containsDisallowedWord(title) {
  return disallowedWords.some((word) =>
    title.toLowerCase().includes(word.toLowerCase())
  );
}

function containsPeriodicity(title) {
  return periodicities.some((period) => title.toLowerCase().includes(period));
}

export {
  normalizeTitle,
  hasDisallowedPrefix,
  hasDisallowedSuffix,
  containsDisallowedWord,
  containsPeriodicity,
};

import { metaphone } from "metaphone";
import { soundex } from "soundex-code";
import stringSimilarity from "string-similarity";
import fuzzy from "fuzzy";

const disallowedPrefixes = ["official", "government", "national", "central", "ministry of", "department of", "prime minister", "president", "certified", "authorized"];
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

function getPhoneticCodes(title) {
  return {
    soundex: soundex(title),
    metaphone: metaphone(title),
  };
}

function similarityScore(titleA, titleB) {
  // Use string-similarity for similarity
  return stringSimilarity.compareTwoStrings(titleA, titleB);
}

function fuzzyMatch(query, choices) {
  // Returns the best fuzzy match from choices for the query
  const results = fuzzy.filter(query, choices);
  return results.length > 0 ? results[0].string : null;
}

export {
  normalizeTitle,
  hasDisallowedPrefix,
  hasDisallowedSuffix,
  containsDisallowedWord,
  containsPeriodicity,
  getPhoneticCodes,
  similarityScore,
  fuzzyMatch,
  disallowedPrefixes,
  disallowedSuffixes,
  disallowedWords,
  periodicities,
};

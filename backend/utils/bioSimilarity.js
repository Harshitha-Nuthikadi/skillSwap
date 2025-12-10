// backend/utils/bioSimilarity.js

// Very simple word-based similarity between two strings.
function bioSimilarity(bioA = "", bioB = "") {
  if (!bioA.trim() || !bioB.trim()) return 0;

  const normalize = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2);

  const wordsA = new Set(normalize(bioA));
  const wordsB = new Set(normalize(bioB));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersection = 0;
  wordsA.forEach((w) => {
    if (wordsB.has(w)) intersection++;
  });

  const union = new Set([...wordsA, ...wordsB]).size;
  const similarity = intersection / union; // 0–1

  return similarity;
}

module.exports = bioSimilarity;

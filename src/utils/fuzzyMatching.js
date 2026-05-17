// Simple fuzzy matching utilities (Levenshtein similarity)
// Used for robust OCR ingredient normalization.

function levenshtein(a, b) {
  if (a === b) return 0;
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  const v0 = new Array(bl + 1).fill(0);
  const v1 = new Array(bl + 1).fill(0);

  for (let i = 0; i <= bl; i++) v0[i] = i;

  for (let i = 0; i < al; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < bl; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      v1[j + 1] = Math.min(
        v1[j] + 1,
        v0[j + 1] + 1,
        v0[j] + cost
      );
    }
    for (let j = 0; j <= bl; j++) v0[j] = v1[j];
  }

  return v1[bl];
}

function similarityScore(a, b) {
  const sa = String(a ?? '').toLowerCase().trim();
  const sb = String(b ?? '').toLowerCase().trim();
  if (!sa && !sb) return 100;
  if (!sa || !sb) return 0;

  const maxLen = Math.max(sa.length, sb.length);
  if (maxLen === 0) return 100;

  const dist = levenshtein(sa, sb);
  const score = (1 - dist / maxLen) * 100;
  return Math.max(0, Math.min(100, Math.round(score)));
}

module.exports = {
  levenshtein,
  similarityScore,
};


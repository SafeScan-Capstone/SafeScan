// Robust normalization of OCR ingredient text.
// Produces standardized ingredient names using dictionary + fuzzy matching.

const { similarityScore } = require('../utils/fuzzyMatching');
const { ingredientDb } = require('./ingredientKnowledgeBase');

// Minimal synonym map for common OCR quirks and ingredient families.
const SYNONYM_MAP = {
  'aqua': 'water',
  'water': 'water',
  'parfum': 'fragrance',
  'perfume': 'fragrance',
  'perfume (fragrance)': 'fragrance',
  'sodium lauryl sulphate': 'sodium lauryl sulfate',
  'sodium laureth sulphate': 'sodium laureth sulfate',
  'aluminium chloride': 'aluminum chloride',
  'aluminum chloride': 'aluminum chloride',
  'steviol': 'steviol glycosides',
  'steviol glycosides': 'steviol glycosides',
  'parsol mcx': 'parsol mcx',
  'parsol mc5': 'parsol mcx',
  'parsol mcx': 'parsol mcx',
};

function normalizeString(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    // remove punctuation, keep alphanumerics and spaces
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanOcrToken(t) {
  // OCR artifacts removal: common degree of noise
  let s = String(t ?? '');
  // Replace common bullet-like artifacts with spaces
  s = s.replace(/[\u00B7\u2022•]/g, ' ');


  s = s.replace(/\b(mc5|mc 5)\b/g, 'mcx');
  s = s.replace(/\bveletas\b/g, '');
  s = s.replace(/\s+/g, ' ').trim();
  return normalizeString(s);
}

function splitMergedIngredients(text) {
  // Split on common delimiters.
  const raw = String(text ?? '');
  return raw
    .split(/[,;|\n]+/g)
    .map(x => x.trim())
    .filter(Boolean);
}

function normalizeIngredientTokens(rawText) {
  if (!rawText || typeof rawText !== 'string') return [];
  const parts = splitMergedIngredients(rawText);

  const tokens = [];
  for (const p of parts) {
    const cleaned = cleanOcrToken(p);
    if (cleaned.length < 2) continue;
    tokens.push(cleaned);
  }

  // de-dup while preserving order
  const seen = new Set();
  const out = [];
  for (const t of tokens) {
    if (!seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  return out;
}

function getCandidateKeys() {
  // ingredientDb keys are already normalized and lowercase.
  return Object.keys(ingredientDb || {});
}

function applySynonym(token) {
  const direct = SYNONYM_MAP[token];
  if (direct) return normalizeString(direct);
  return token;
}

function fuzzyMatchToDictionary(token, threshold = 80) {
  const t = applySynonym(token);
  const candidates = getCandidateKeys();

  let best = null;
  let bestScore = 0;

  for (const c of candidates) {
    const score = similarityScore(t, c);
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }

  if (best && bestScore >= threshold) return { key: best, score: bestScore };
  return null;
}

function normalizeIngredient(raw) {
  const normalizedTokens = normalizeIngredientTokens(raw);
  const normalizedNames = [];

  for (const token of normalizedTokens) {
    // Exact match in KB
    const synonymApplied = applySynonym(token);
    if (ingredientDb?.[synonymApplied]) {
      normalizedNames.push(synonymApplied);
      continue;
    }

    // Fuzzy
    const hit = fuzzyMatchToDictionary(token, 80);
    if (hit?.key) {
      normalizedNames.push(hit.key);
      continue;
    }

    // fallback: use synonym applied token as-is
    normalizedNames.push(synonymApplied);
  }

  return normalizedNames;
}

module.exports = {
  normalizeIngredientTokens,
  normalizeIngredient,
};


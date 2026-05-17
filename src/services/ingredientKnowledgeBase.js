// Ingredient knowledge base for deterministic ingredient analysis fallback.
// This is intentionally lightweight and uses existing local dataset as the primary reference.

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'ingredients.json');

let ingredientDb = {};
try {
  ingredientDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
} catch (e) {
  ingredientDb = {};
}

function capitalizeWords(str) {
  return String(str)
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Convert local dataset entries into the richer analysis schema.
function toKbEntry(name) {
  const key = String(name).toLowerCase().trim();
  const hit = ingredientDb[key];
  const status = hit?.status || 'Unknown';
  const explanation = hit?.explanation || '';

  // Provide best-effort deterministic fields.
  // Since the current local dataset is minimal (status/explanation), we synthesize the rest.
  const purposeMap = {
    safe: 'General cosmetic ingredient used for its functional role.',
    risky: 'May serve a cosmetic functional role but can be a concern for some sensitive users.',
    restricted: 'Has safety/regulatory concerns; may be restricted or discouraged in some markets.',
    unknown: 'Functional role unknown in local dataset.',
  };

  const risksByStatus = {
    safe: ["Generally well tolerated in typical cosmetic use."] ,
    risky: ["May cause irritation or sensitivity in some individuals."] ,
    restricted: ["Restricted/banned in some regions or associated with significant safety concerns."] ,
    unknown: ["Limited information in local dataset; use caution if sensitive."] ,
  };

  const concernsByStatus = {
    safe: [],
    risky: ["Potential irritation/sensitivity"],
    restricted: ["Potential regulatory/safety concerns"],
    unknown: [],
  };

  const regulatoryDefaults = {
    fda: status === 'Restricted' ? 'Not commonly permitted / subject to restrictions.' : 'Permitted in typical cosmetic formulations (context-dependent).',
    eu: status === 'Restricted' ? 'May be restricted in the EU depending on specific substance and use.' : 'Generally allowed for cosmetic use (context-dependent).',
    ewg: status === 'Restricted' ? 'Higher hazard rating possible.' : 'Variable hazard rating depending on substance.',
  };

  const recByStatus = {
    safe: 'Generally safe for most users, including those with mild sensitivity (patch test if unsure).',
    risky: 'Caution for sensitive users; consider patch testing and avoiding if you have known fragrance/irritant sensitivities.',
    restricted: 'Avoid or use only under professional guidance; particularly avoid if you have sensitive skin.',
    unknown: 'If you have sensitivities, consider avoiding or patch testing before regular use.',
  };

  const normalizedStatus = status;
  const score = normalizedStatus === 'Safe' ? 90 : normalizedStatus === 'Risky' ? 70 : normalizedStatus === 'Restricted' ? 40 : 55;

  const purpose = purposeMap[
    normalizedStatus === 'Safe' ? 'safe' :
    normalizedStatus === 'Risky' ? 'risky' :
    normalizedStatus === 'Restricted' ? 'restricted' :
    'unknown'
  ];

  const risks = risksByStatus[
    normalizedStatus === 'Safe' ? 'safe' :
    normalizedStatus === 'Risky' ? 'risky' :
    normalizedStatus === 'Restricted' ? 'restricted' :
    'unknown'
  ];

  const concerns = concernsByStatus[
    normalizedStatus === 'Safe' ? 'safe' :
    normalizedStatus === 'Risky' ? 'risky' :
    normalizedStatus === 'Restricted' ? 'restricted' :
    'unknown'
  ];

  const description = explanation || (normalizedStatus === 'Safe'
    ? 'A recognized ingredient considered safe for typical cosmetic use.'
    : normalizedStatus === 'Risky'
      ? 'This ingredient may cause sensitivity or irritation in some individuals.'
      : normalizedStatus === 'Restricted'
        ? 'This ingredient is restricted or banned in some regions due to safety concerns.'
        : 'We could not verify this ingredient. If you have concerns, consult a dermatologist.');

  const recommendation = recByStatus[
    normalizedStatus === 'Safe' ? 'safe' :
    normalizedStatus === 'Risky' ? 'risky' :
    normalizedStatus === 'Restricted' ? 'restricted' :
    'unknown'
  ];

  const sources = ['SafeScan Local Ingredient DB'];

  return {
    ingredient: capitalizeWords(name),
    status: normalizedStatus,
    score,
    purpose,
    description,
    risks,
    concerns,
    regulatory: regulatoryDefaults,
    recommendation,
    confidence: score,
    sources,
  };
}

function getKbEntryByNormalizedName(normalizedName) {
  if (!normalizedName) return null;
  const key = String(normalizedName).toLowerCase().trim();
  const hit = ingredientDb[key];
  if (!hit) return null;
  return toKbEntry(key);
}

function getKbEntryByRawName(rawName) {
  if (!rawName) return null;
  const normalized = normalizeForLookup(rawName);
  return getKbEntryByNormalizedName(normalized);
}

function normalizeForLookup(s) {
  return String(s ?? '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

module.exports = {
  ingredientDb,
  getKbEntryByNormalizedName,
  getKbEntryByRawName,
  toKbEntry,
};


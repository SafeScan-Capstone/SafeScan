// Ingredient analysis producing guaranteed strict JSON schema.

const { z } = require('zod');

const { normalizeIngredient } = require('./normalizeIngredient');
const { getKbEntryByNormalizedName } = require('./ingredientKnowledgeBase');

const RegulatorySchema = z.object({
  fda: z.string().optional().default(''),
  eu: z.string().optional().default(''),
  ewg: z.string().optional().default(''),
});

const IngredientAnalysisSchema = z.object({
  ingredient: z.string().min(1),
  status: z.enum(['SAFE', 'CAUTION', 'AVOID']),
  score: z.number().int().min(0).max(100),
  purpose: z.string(),
  description: z.string(),
  risks: z.array(z.string()).default([]),
  concerns: z.array(z.string()).default([]),
  regulatory: RegulatorySchema,
  recommendation: z.string(),
  confidence: z.number().int().min(0).max(100),
  sources: z.array(z.string()).default([]),
});

const IngredientAnalysisArraySchema = z.array(IngredientAnalysisSchema);

function mapStatusFromKb(kbStatus) {
  const s = String(kbStatus || '').toLowerCase();
  if (s === 'safe') return 'SAFE';
  if (s === 'risky') return 'CAUTION';
  if (s === 'restricted') return 'AVOID';
  return 'CAUTION';
}

function normalizeToSchemaName(name) {
  return String(name).trim();
}

function defaultAnalysisForUnknown(ingredient) {
  return {
    ingredient: normalizeToSchemaName(ingredient),
    status: 'CAUTION',
    score: 55,
    purpose: 'Functional role unknown in local dataset.',
    description: 'We could not verify this ingredient in the local reference database. If you have sensitivities, consider patch testing or consulting a healthcare professional.',
    risks: ['Limited information; may cause irritation for sensitive users.'],
    concerns: [],
    regulatory: { fda: '', eu: '', ewg: '' },
    recommendation: 'If you have sensitive skin, consider avoiding or patch testing before regular use.',
    confidence: 55,
    sources: ['SafeScan Local Ingredient DB (unknown entry)'],
  };
}

async function analyzeIngredient(rawIngredient) {
  const candidates = normalizeIngredient(rawIngredient);
  const first = candidates?.[0] || rawIngredient;

  // Deterministic KB fallback (always)
  const kbEntry = getKbEntryByNormalizedName(first);

  if (!kbEntry) {
    const analysis = defaultAnalysisForUnknown(rawIngredient);
    return IngredientAnalysisSchema.parse(analysis);
  }

  const status = mapStatusFromKb(kbEntry.status);
  const score = kbEntry.score ?? (status === 'SAFE' ? 90 : status === 'CAUTION' ? 70 : 40);

  const analysis = {
    ingredient: kbEntry.ingredient || rawIngredient,
    status,
    score,
    purpose: kbEntry.purpose || 'Functional purpose not specified in local dataset.',
    description: kbEntry.description || kbEntry.riskExplanation || 'Description not available.',
    risks: Array.isArray(kbEntry.risks) ? kbEntry.risks : [],
    concerns: Array.isArray(kbEntry.concerns) ? kbEntry.concerns : [],
    regulatory: kbEntry.regulatory || { fda: '', eu: '', ewg: '' },
    recommendation: kbEntry.recommendation || 'Patch test if sensitive.',
    confidence: kbEntry.confidence ?? score,
    sources: Array.isArray(kbEntry.sources) ? kbEntry.sources : ['SafeScan Local Ingredient DB'],
  };

  // Validate to guarantee strict schema
  return IngredientAnalysisSchema.parse(analysis);
}


function parseRequiredSchemaArray(output) {
  return IngredientAnalysisArraySchema.parse(output);
}

module.exports = {
  IngredientAnalysisSchema,
  IngredientAnalysisArraySchema,
  analyzeIngredient,
  parseRequiredSchemaArray,
};


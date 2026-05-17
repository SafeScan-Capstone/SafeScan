# TODO - Fix ingredient analysis pipeline (SafeScan)

- [x] Implement backend ingredient knowledge base (ingredientKnowledgeBase)
- [x] Implement normalization + fuzzy matching (normalizeIngredient + Levenshtein)
- [x] Implement deterministic analyzer with guaranteed strict schema (analyzeIngredient)

- [x] Add Zod validation for analysis output and fallback on invalid AI

- [x] Wire new analyzer into scan pipeline (performFullAnalysis in src/controllers/scan.controller.js)


- [x] Update scan/analyze response so frontend receives full structured ingredient objects

- [ ] Update frontend Results transformer to use structured fields
- [ ] Update IngredientResultCard UI to render purpose/risks/recommendation/confidence/etc
- [ ] Ensure frontend never shows "No AI output returned for this ingredient" by guaranteeing fallback
- [ ] Smoke test: run scan/analyze flow with example OCR input and verify full cards


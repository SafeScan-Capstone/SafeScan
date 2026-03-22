import { useEffect, useRef } from 'react'
import apiUrl from '../../utils/apiUrl'
import { useNavigate, useLocation } from 'react-router-dom'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

function extractIngredientNames(text) {
    if (!text) return []
    const match = text.match(/ingredients[:\s]*/i)
    let section = match ? text.slice(text.search(/ingredients[:\s]*/i) + match[0].length) : text
    const stop = section.search(/directions:|warnings?:|precautions:|how to use:|caution:|store|manufactured|\(F\.I\.L/i)
    if (stop !== -1) section = section.slice(0, stop)
    return section
        .split(/,|\n/)
        .map(s => s.replace(/\*.*$/, '').trim())
        .filter(s => s.length > 1 && s.length < 80 && !/^\d/.test(s) && !/copyright/i.test(s))
}

function chunkArray(arr, size) {
    const chunks = []
    for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size))
    return chunks
}

async function geminiCall(ingredientsList, retries = 2) {
    if (!ingredientsList.length || !GEMINI_API_KEY) return []

    const prompt = `You are a cosmetic and food ingredient safety expert.

Analyze EVERY ingredient listed below. You MUST return one entry per ingredient — do not skip any.

For each ingredient return a JSON object with:
- "name": the ingredient name exactly as given
- "status": exactly one of "Safe", "Risky", or "Restricted"
  • Safe = widely used, no significant health concerns
  • Risky = may cause sensitivity, irritation, or hormonal concern for some people  
  • Restricted = banned or limited in some countries, linked to serious health concerns
- "explanation": 1 plain English sentence: what it is and why it got that status. No jargon.

Ingredients to analyze (${ingredientsList.length} total):
${ingredientsList.map((n, i) => `${i + 1}. ${n}`).join('\n')}

Return ONLY a valid JSON array with exactly ${ingredientsList.length} objects. No markdown, no code fences, no commentary.`

    const doFetch = () => fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.1, maxOutputTokens: 4096 }
            })
        }
    )

    for (let attempt = 0; attempt <= retries; attempt++) {
        if (attempt > 0) {
            const delay = attempt === 1 ? 8000 : 15000
            console.warn(`[SafeScan] Gemini retry ${attempt} in ${delay / 1000}s...`)
            await new Promise(r => setTimeout(r, delay))
        }

        try {
            const res = await doFetch()
            if (res.status === 429) continue // retry

            if (!res.ok) {
                console.warn('[SafeScan] Gemini error:', res.status)
                return []
            }

            const data = await res.json()
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
            const clean = rawText.replace(/```json|```/g, '').trim()
            const parsed = JSON.parse(clean)
            return Array.isArray(parsed) ? parsed : []
        } catch (err) {
            console.warn('[SafeScan] Gemini parse error:', err)
            if (attempt === retries) return []
        }
    }
    return []
}

// Send ingredients to Gemini in batches, then re-request any that were skipped
async function analyzeWithGemini(ingredientsList) {
    if (!ingredientsList.length || !GEMINI_API_KEY) return []

    const chunks = chunkArray(ingredientsList, 15)
    let allResults = []

    for (let i = 0; i < chunks.length; i++) {
        if (i > 0) await new Promise(r => setTimeout(r, 2000))
        const batch = await geminiCall(chunks[i])
        allResults.push(...batch)
    }

    // Find any ingredients Gemini skipped
    const returnedNames = new Set(allResults.map(r => r.name?.toLowerCase()))
    const skipped = ingredientsList.filter(n => !returnedNames.has(n.toLowerCase()))

    // Re-request skipped ones individually (max 1 retry batch)
    if (skipped.length > 0) {
        console.warn('[SafeScan] Gemini skipped these, re-requesting:', skipped)
        await new Promise(r => setTimeout(r, 3000))
        const retryResults = await geminiCall(skipped)
        allResults.push(...retryResults)
    }

    return allResults
}

export default function Analyzing() {
    const navigate = useNavigate()
    const location = useLocation()
    const ingredients = location.state?.ingredients ?? ''
    const scanId = location.state?.scanId ?? null
    const productCategory = location.state?.productCategory ?? ''

    const hasRun = useRef(false)

    useEffect(() => {
        if (hasRun.current) return
        hasRun.current = true

        const analyze = async () => {
            try {
                const token = localStorage.getItem('token')
                const headers = {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                }

                // Step 1 — backend dataset analysis
                const requestBody = { text: ingredients }
                if (productCategory) requestBody.productCategory = productCategory

                const res = await fetch(`${apiUrl}/api/scan/analyze`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(requestBody)
                })
                const data = await res.json()

                // If backend fails entirely, run everything through Gemini
                if (!res.ok) {
                    console.warn('[SafeScan] Backend failed, using full Gemini fallback')
                    const allNames = extractIngredientNames(ingredients)
                    const geminiRaw = await analyzeWithGemini(allNames)
                    const returnedNames = new Set(geminiRaw.map(g => g.name?.toLowerCase()))

                    const fallbackResults = allNames.map(name => {
                        const found = geminiRaw.find(g => g.name?.toLowerCase() === name.toLowerCase())
                        // Only mark as safe if Gemini explicitly said so
                        // If Gemini didn't return it at all, mark as unknown so user knows
                        const status = found?.status ?? (returnedNames.has(name.toLowerCase()) ? 'Safe' : null)
                        return {
                            ingredient: name, name,
                            status: status ?? 'Unknown',
                            explanation: found?.explanation ?? null,
                            fromAI: true, fromGemini: true,
                        }
                    })

                    const fallbackSummary = {
                        safe: fallbackResults.filter(i => i.status === 'Safe').length,
                        risky: fallbackResults.filter(i => i.status === 'Risky').length,
                        restricted: fallbackResults.filter(i => i.status === 'Restricted').length,
                        unknown: fallbackResults.filter(i => i.status === 'Unknown').length,
                    }
                    navigate(`/scan-result/${scanId ?? 1}`, {
                        replace: true,
                        state: { result: { results: fallbackResults, summary: fallbackSummary, risk_level: fallbackSummary.restricted > 0 ? 'HIGH' : fallbackSummary.risky > 0 ? 'MEDIUM' : 'LOW', productCategory } }
                    })
                    return
                }

                // Step 2 — normalize backend ingredients
                // Backend dataset items have passed a safety check so their status is reliable
                const backendIngredients = (data.ingredients ?? data.results ?? data.matched_ingredients ?? [])
                    .map(i => ({
                        ingredient: i.ingredient ?? i.name,
                        name: i.ingredient ?? i.name,
                        status: i.status && i.status !== 'Unknown' ? i.status : 'Safe',
                        explanation: i.explanation ?? i.reason ?? null,
                        source: i.source ?? 'dataset',
                        fromAI: false,
                        fromGemini: false,
                    }))

                // Step 3 — find ingredients the dataset didn't cover
                const allIngredientNames = extractIngredientNames(ingredients)
                const matchedNames = new Set(backendIngredients.map(i => i.name.toLowerCase()))
                const unmatched = allIngredientNames.filter(
                    name => !matchedNames.has(name.toLowerCase()) && name.length > 1
                )

                // Step 4 — Gemini analyzes unmatched ingredients
                let geminiResults = []
                if (unmatched.length > 0) {
                    const geminiRaw = await analyzeWithGemini(unmatched)
                    geminiResults = unmatched.map(name => {
                        const found = geminiRaw.find(g => g.name?.toLowerCase() === name.toLowerCase())

                        if (found) {
                            // Gemini returned a result — use it exactly, status is Safe/Risky/Restricted
                            return {
                                ingredient: name, name,
                                status: found.status,
                                explanation: found.explanation ?? '',
                                fromAI: true, fromGemini: true,
                            }
                        } else {
                            // Gemini didn't return this ingredient even after retry
                            // Mark as Unknown — we won't guess
                            return {
                                ingredient: name, name,
                                status: 'Unknown',
                                explanation: null,
                                fromAI: true, fromGemini: true,
                            }
                        }
                    })
                }

                // Step 5 — merge and calculate summary
                const mergedResults = [...backendIngredients, ...geminiResults]

                const summary = {
                    safe: mergedResults.filter(i => i.status === 'Safe').length,
                    risky: mergedResults.filter(i => i.status === 'Risky').length,
                    restricted: mergedResults.filter(i => i.status === 'Restricted').length,
                    unknown: mergedResults.filter(i => i.status === 'Unknown').length,
                }

                const overallRiskLevel = summary.restricted > 0 ? 'HIGH' : summary.risky > 0 ? 'MEDIUM' : 'LOW'

                navigate(`/scan-result/${data.scanId ?? scanId ?? 1}`, {
                    replace: true,
                    state: {
                        result: {
                            ...data,
                            results: mergedResults,
                            summary,
                            risk_level: overallRiskLevel,
                            productCategory,
                        },
                    }
                })
            } catch (err) {
                console.error('Analysis failed:', err)
                navigate('/scan-home', { replace: true })
            }
        }

        if (ingredients) {
            analyze()
        } else {
            navigate('/scan-home', { replace: true })
        }
    }, [])

    return (
        <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-3xl border border-border shadow-sm flex flex-col items-center justify-center px-8 py-16 text-center">
                <div className="relative h-16 w-16 mb-6">
                    <svg className="animate-spin h-16 w-16" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="26" stroke="#E0EFEE" strokeWidth="6" />
                        <path d="M32 6 a26 26 0 0 1 26 26" stroke="url(#spinnerGrad)" strokeWidth="6" strokeLinecap="round" />
                        <defs>
                            <linearGradient id="spinnerGrad" x1="32" y1="6" x2="58" y2="32" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#0D645D" />
                                <stop offset="100%" stopColor="#A8D5D2" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-text-title mb-2">Analyzing ingredients...</h2>
                <p className="text-sm text-text-secondary">Cross-referencing database and AI analysis.</p>
                <p className="text-xs text-text-secondary mt-1 opacity-60">This may take a few seconds.</p>
            </div>
        </div>
    )
}
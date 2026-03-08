import { useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SummaryBadge from "../components/ingredients/SummaryBadge";
import IngredientResultCard from "../components/ingredients/IngredientResultCard";
import Button from "../components/ui/Button";
import bottle1 from '../assets/images/bottle1.jpeg'
import bottle2 from '../assets/images/bottle2.jpeg'
import bottle3 from '../assets/images/bottle3.jpeg'
import bottle4 from '../assets/images/bottle4.jpeg'
import bottle5 from '../assets/images/bottle5.jpeg'
import bottle6 from '../assets/images/bottle6.jpeg'
import bottle7 from '../assets/images/bottle7.jpeg'
import bottle8 from '../assets/images/bottle8.jpeg'
import bottle9 from '../assets/images/bottle9.jpeg'
import bottle10 from '../assets/images/bottle10.jpeg'

const BOTTLE_IMAGES = [
    bottle1, bottle2, bottle3, bottle4, bottle5,
    bottle6, bottle7, bottle8, bottle9, bottle10,
]

// Pick a different bottle each session (changes on new tab/scan, not mid-session)
function getSessionBottle() {
    const key = 'safescan_bottle_index'
    let idx = sessionStorage.getItem(key)
    if (idx === null) {
        // Rotate based on day so it genuinely changes over time
        idx = Math.floor(Date.now() / (1000 * 60 * 60 * 6)) % BOTTLE_IMAGES.length
        sessionStorage.setItem(key, idx)
    }
    return BOTTLE_IMAGES[Number(idx)]
}

// ---------------------------------------------------------------------------

const RISK_CONFIG = {
    HIGH: {
        label: 'High Risk Detected',
        description: 'Contains ingredients that are restricted or of concern.',
        badge: 'Restricted',
        bannerClass: 'bg-[#FDECEC] border border-[#F5C2C2]',
        labelClass: 'text-danger',
        iconClass: 'text-danger',
        badgeClass: 'bg-[#FDECEC] text-danger border border-danger',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
    },
    MEDIUM: {
        label: 'Caution Advised',
        description: 'Some ingredients may cause sensitivity or irritation for certain skin types.',
        badge: 'Risky',
        bannerClass: 'bg-[#FFF7E6] border border-[#FDDFA0]',
        labelClass: 'text-risky',
        iconClass: 'text-risky',
        badgeClass: 'bg-[#FFF7E6] text-risky border border-risky',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
    },
    LOW: {
        label: 'All Clear',
        description: 'No harmful or restricted ingredients detected in this product.',
        badge: 'Safe',
        bannerClass: 'bg-[#ECF8EF] border border-[#A3D9B1]',
        labelClass: 'text-[#43B75D]',
        iconClass: 'text-[#43B75D]',
        badgeClass: 'bg-[#ECF8EF] text-[#43B75D] border border-[#43B75D]',
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    },
}

function mapSafety(item) {
    const s = item.status ?? ''
    const r = item.risk_level ?? ''
    if (s === 'Restricted' || r === 'HIGH') return 'restricted'
    if (s === 'Risky' || r === 'MEDIUM') return 'risky'
    if (s === 'Safe' || r === 'LOW') return 'safe'
    // Dataset items with no status passed a safety check — safe
    if (!item.fromAI && !item.fromGemini) return 'safe'
    // Gemini/AI items with no clear status — genuinely unknown, show honestly
    return 'unknown'
}

function transformResults(data) {
    const seen = new Set()
    return (data.results ?? data.matched_ingredients ?? [])
        .filter((item) => {
            const name = (item.ingredient ?? item.name ?? '').toLowerCase()
            if (!name || seen.has(name)) return false
            seen.add(name)
            return true
        })
        .filter(item => (item.status ?? 'Unknown') !== 'Unknown')
        .map((item, index) => ({
            id: index + 1,
            name: item.ingredient ?? item.name,
            safety: mapSafety(item),
            description: item.explanation ?? item.reason ?? '',
            fromAI: item.fromAI ?? false,
            fromGemini: item.fromGemini ?? false,
        }))
}

export default function Results() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const data = location.state?.result

    // Pick bottle once per session
    const bottleImage = useMemo(() => getSessionBottle(), [])

    if (!data) {
        navigate('/scan-home', { replace: true })
        return null
    }

    const riskLevel = data.risk_level ?? 'LOW'
    const ingredients = transformResults(data)
    const safeCount = ingredients.filter(i => i.safety === 'safe').length
    const riskyCount = ingredients.filter(i => i.safety === 'risky').length
    const restrictedCount = ingredients.filter(i => i.safety === 'restricted').length
    const unknownCount = ingredients.filter(i => i.safety === 'unknown').length

    // Build context-aware banner based on actual counts
    const baseRisk = RISK_CONFIG[riskLevel] ?? RISK_CONFIG.LOW
    const total = ingredients.length
    const risk = {
        ...baseRisk,
        description: riskLevel === 'HIGH'
            ? restrictedCount === 1 && safeCount > 5
                ? `Contains 1 restricted ingredient out of ${total} total. The majority (${safeCount}) are safe — use with caution if you have sensitivities.`
                : `Contains ${restrictedCount} restricted ingredient${restrictedCount > 1 ? 's' : ''} that ${restrictedCount > 1 ? 'are' : 'is'} banned or of concern in some regions.`
            : riskLevel === 'MEDIUM'
                ? `${riskyCount} ingredient${riskyCount > 1 ? 's' : ''} may cause sensitivity or irritation for certain skin types.`
                : baseRisk.description,
    }

    const SAFETY_ORDER = { restricted: 0, risky: 1, safe: 2, unknown: 3 }
    const sortedIngredients = [...ingredients].sort((a, b) => SAFETY_ORDER[a.safety] - SAFETY_ORDER[b.safety])

    const totalIngredients = ingredients.length
    const aiAnalyzedCount = ingredients.filter(i => i.fromAI || i.fromGemini).length

    return (
        <div className="mx-auto max-w-md md:max-w-[1440px] px-4 py-6 md:px-10 md:py-8">
            <div className="flex items-center justify-between mb-5 md:mb-8">
                <button type="button" onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm font-medium text-text-title hover:text-primary transition-colors">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
                <h1 className="text-base font-bold text-primary">Scan Results</h1>
                <div className="w-12" />
            </div>

            <div className="md:flex md:justify-center">
                <div className="flex flex-col md:flex-row md:gap-16 md:items-start">

                    {/* Left column — rotating bottle image */}
                    <div className="md:w-[380px] md:shrink-0 md:flex md:flex-col">
                        <div className="relative rounded-2xl overflow-hidden h-[400px] md:flex-1 mb-4 bg-[#F2FAF9]">
                            <img
                                src={bottleImage}
                                alt="Scanned product"
                                className="w-full h-full object-contain p-6"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            {/* Ingredient count badge bottom-left */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <p className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">
                                    Ingredients scanned
                                </p>
                                <p className="text-2xl font-bold text-white leading-tight">
                                    {totalIngredients}
                                    <span className="text-sm font-normal text-white/70 ml-2">ingredients found</span>
                                </p>
                                {aiAnalyzedCount > 0 && (
                                    <p className="text-xs text-white/60 mt-0.5">
                                        {aiAnalyzedCount} analyzed by AI
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button text="Scan Another" variant="primary" onClick={() => navigate('/scan-home')} />
                    </div>

                    {/* Right column — results */}
                    <div className="flex-1 mt-5 md:max-w-[520px] md:mt-0">

                        {/* Risk banner — NO product name or category */}
                        <div className={`rounded-2xl p-4 mb-5 ${risk.bannerClass}`}>
                            <div className={`flex items-center gap-2 mb-2 ${risk.iconClass}`}>
                                {risk.icon}
                                <p className={`font-bold text-base ${risk.labelClass}`}>{risk.label}</p>
                            </div>
                            <p className="text-sm text-text-body mb-3">{risk.description}</p>
                            {data.disclaimer && (
                                <p className="text-xs text-text-secondary italic mb-3">{data.disclaimer}</p>
                            )}
                            <div className="flex items-center justify-end">
                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border ${risk.badgeClass}`}>
                                    {risk.badge}
                                </span>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="mb-4">
                            <p className="text-base font-bold text-text-title mb-3">Summary</p>
                            <div className="flex gap-3 flex-wrap">
                                <SummaryBadge count={safeCount} label="Safe" dotClass="bg-[#43B75D]" badgeClass="bg-[#ECF8EF] text-[#43B75D] border-[#43B75D]" />
                                <SummaryBadge count={riskyCount} label="Risky" dotClass="bg-risky" badgeClass="bg-[#FFF7E6] text-risky border-risky" />
                                <SummaryBadge count={restrictedCount} label="Restricted" dotClass="bg-danger" badgeClass="bg-[#FDECEC] text-danger border-danger" />
                                <SummaryBadge count={unknownCount} label="Unknown" dotClass="bg-gray-400" badgeClass="bg-gray-100 text-gray-500 border-gray-300" />
                            </div>
                        </div>

                        {/* Recommendations */}
                        {data.recommendations?.length > 0 && (
                            <div className="mb-4 bg-teal-50 rounded-2xl p-4">
                                <p className="text-sm font-bold text-text-title mb-2">Recommendations</p>
                                <ul className="flex flex-col gap-1">
                                    {data.recommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-text-body">
                                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Ingredient Analysis */}
                        <div className="mb-6">
                            <p className="text-base font-bold text-text-title mb-3">Ingredient Analysis</p>
                            <div className="flex flex-col gap-3">
                                {sortedIngredients.map((ingredient) => (
                                    <IngredientResultCard key={ingredient.id} {...ingredient} />
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
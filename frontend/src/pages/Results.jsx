import { useNavigate, useParams, useLocation } from "react-router-dom";
import ScanImg from '../assets/images/scanImg.svg';
import SummaryBadge from "../components/ingredients/SummaryBadge";
import IngredientResultCard from "../components/ingredients/IngredientResultCard";
import Button from "../components/ui/Button";
import { RISK_CONFIG } from "../constants/riskConfig";

function transformResults(data) {
    const seen = new Set()
    return (data.results ?? data.matched_ingredients ?? [])
        .filter((item) => {
            const name = (item.ingredient ?? item.name ?? '').toLowerCase()
            if (seen.has(name)) return false
            seen.add(name)
            return true
        })
        .map((item, index) => ({
            id: index + 1,
            name: item.ingredient ?? item.name,
            safety: item.status === 'Restricted' || item.risk_level === 'HIGH' ? 'restricted'
                : item.status === 'Risky' || item.risk_level === 'MEDIUM' ? 'risky'
                    : item.status === 'Unknown' || item.status === 'unknown' ? 'unknown'
                        : 'safe',
            description: item.explanation ?? item.reason ?? '',
        }))

}


export default function Results() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const data = location.state?.result

    if (!data) {
        navigate('/scan-home', { replace: true })
        return null
    }

    const riskLevel = data.risk_level ?? 'LOW'
    const risk = RISK_CONFIG[riskLevel] ?? RISK_CONFIG.LOW
    const ingredients = transformResults(data)
    const summary = data.summary ?? {}

    const safeCount = summary.safe ?? ingredients.filter(i => i.safety === 'safe').length
    const riskyCount = summary.risky ?? ingredients.filter(i => i.safety === 'risky').length
    const restrictedCount = summary.restricted ?? ingredients.filter(i => i.safety === 'restricted').length

    const SAFETY_ORDER = { restricted: 0, risky: 1, safe: 2 }
    const sortedIngredients = [...ingredients].sort((a, b) => SAFETY_ORDER[a.safety] - SAFETY_ORDER[b.safety])

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

                    <div className="md:w-[380px] md:shrink-0 md:flex md:flex-col">
                        <div className="relative rounded-2xl overflow-hidden h-[400px] md:flex-1 mb-4">
                            <img src={ScanImg} alt="Product" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                                    {data.productCategory ?? 'Product'}
                                </p>
                                <h2 className="text-xl font-bold text-white leading-tight">Scan Result</h2>
                            </div>
                        </div>
                        <Button text="Scan Another" variant="primary" onClick={() => navigate('/scan-home')} />
                    </div>

                    <div className="flex-1 mt-5 md:max-w-[520px] md:mt-0">

                        <div className={`rounded-2xl p-4 mb-5 ${risk.bannerClass}`}>
                            <div className={`flex items-center gap-2 mb-2 ${risk.iconClass}`}>
                                {risk.icon}
                                <p className={`font-bold text-base ${risk.labelClass}`}>{risk.label}</p>
                            </div>
                            <p className="text-sm text-text-body mb-3">{risk.description}</p>
                            {data.disclaimer && (
                                <p className="text-xs text-text-secondary italic mb-3">{data.disclaimer}</p>
                            )}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-text-secondary">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                    Category:
                                    <span className="text-text-title font-medium capitalize">{data.productCategory ?? '—'}</span>
                                </div>
                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border ${risk.badgeClass}`}>
                                    {risk.badge}
                                </span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-base font-bold text-text-title mb-3">Summary</p>
                            <div className="flex gap-3">
                                <SummaryBadge count={safeCount} label="Safe" dotClass="bg-[#43B75D]" badgeClass="bg-[#ECF8EF] text-[#43B75D] border-[#43B75D]" />
                                <SummaryBadge count={riskyCount} label="Risky" dotClass="bg-risky" badgeClass="bg-[#FFF7E6] text-risky border-risky" />
                                <SummaryBadge count={restrictedCount} label="Restricted" dotClass="bg-danger" badgeClass="bg-[#FDECEC] text-danger border-danger" />
                                <SummaryBadge count={summary.unknown ?? ingredients.filter(i => i.safety === 'unknown').length} label="Unknown" dotClass="bg-gray-400" badgeClass="bg-gray-100 text-gray-500 border-gray-300"
                                />
                            </div>
                        </div>

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
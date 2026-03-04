export const RISK_CONFIG = {
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

import { Link } from 'react-router-dom'

export default function TermsOfService() {
    return (
        <div className="mx-auto max-w-3xl px-6 py-10">
            <h1 className="text-3xl font-bold text-text-title mb-2">Terms of Service</h1>
            <p className="text-sm text-text-secondary mb-8">Last updated: March 2026</p>

            <div className="flex flex-col gap-6 text-sm text-text-body leading-relaxed">
                <section>
                    <h2 className="text-base font-bold text-text-title mb-2">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using SafeScan, you agree to be bound by these Terms of Service.
                        If you do not agree, please do not use the service.
                    </p>
                </section>

                <section>
                    <h2 className="text-base font-bold text-text-title mb-2">2. Informational Use Only</h2>
                    <p>
                        SafeScan provides ingredient analysis for informational purposes only. Results are
                        not medical advice. Always consult a qualified healthcare professional before making
                        decisions about your health or skincare routine.
                    </p>
                </section>

                <section>
                    <h2 className="text-base font-bold text-text-title mb-2">3. User Accounts</h2>
                    <p>
                        You are responsible for maintaining the confidentiality of your account credentials
                        and for all activity that occurs under your account.
                    </p>
                </section>

                <section>
                    <h2 className="text-base font-bold text-text-title mb-2">4. Prohibited Use</h2>
                    <p>
                        You may not use SafeScan to violate any law, infringe any third-party rights, or
                        attempt to gain unauthorised access to our systems.
                    </p>
                </section>

                <section>
                    <h2 className="text-base font-bold text-text-title mb-2">5. Limitation of Liability</h2>
                    <p>
                        SafeScan is provided "as is" without warranties of any kind. We are not liable for
                        any direct, indirect, or consequential damages arising from your use of the service.
                    </p>
                </section>

                <section>
                    <h2 className="text-base font-bold text-text-title mb-2">6. Changes to Terms</h2>
                    <p>
                        We may update these terms at any time. Continued use of SafeScan after changes
                        constitutes acceptance of the revised terms.
                    </p>
                </section>
            </div>

            <p className="mt-8 text-sm text-text-secondary">
                For privacy-related matters, see our{' '}
                <Link to="/privacy" className="text-primary hover:underline font-semibold">
                    Privacy Policy
                </Link>
                .
            </p>
        </div>
    )
}

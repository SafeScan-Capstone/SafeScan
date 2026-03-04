import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-6 text-center">
            <p className="text-7xl font-black text-primary mb-4">404</p>
            <h1 className="text-2xl font-bold text-text-title mb-2">Page Not Found</h1>
            <p className="text-sm text-text-secondary mb-8 max-w-sm">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors"
            >
                Back to Home
            </Link>
        </div>
    )
}

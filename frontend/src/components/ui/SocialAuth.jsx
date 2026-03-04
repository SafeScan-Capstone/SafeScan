import { Link } from 'react-router-dom';
import Apple from '../../assets/icons/apple.svg?react'
import Google from '../../assets/icons/google.svg?react'
import Facebook from '../../assets/icons/facebook.svg?react'

const SOCIAL_PROVIDERS = [
    { label: 'Apple', Icon: Apple },
    { label: 'Google', Icon: Google },
    { label: 'Facebook', Icon: Facebook },
]

export default function SocialAuth({ auth, alternateLink, redirectTo }) {
    return (
        <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex items-center w-full gap-3">
                <div className="flex-1 h-px bg-gray-300" />
                <p className="text-sm text-text-body whitespace-nowrap">
                    or {auth} with
                </p>
                <div className="flex-1 h-px bg-gray-300" />
            </div>

            <div className="flex items-center gap-4">
                {SOCIAL_PROVIDERS.map(({ label, Icon }) => (
                    <div key={label} className="relative group">
                        <button
                            type="button"
                            disabled
                            aria-label={`${label} sign-in — coming soon`}
                            className="p-3 border border-deep-teal rounded-lg opacity-40 cursor-not-allowed"
                        >
                            <Icon className="w-5 h-5" />
                        </button>
                        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            Coming soon
                        </span>
                    </div>
                ))}
            </div>

            <div>
                <p className='text-text-secondary'>
                    Already have an account?{' '}
                    <Link to={redirectTo} className='text-deep-teal'>{alternateLink}</Link>
                </p>
            </div>
        </div>
    );
}

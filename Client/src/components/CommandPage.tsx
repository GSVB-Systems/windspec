import {RibbonBackground} from "./RibbonBackground.tsx";
import {useNavigate} from "react-router";

export default function CommandPage() {
    const navigate = useNavigate();

    const handleDashboard = () => {
        navigate('/')
    }

    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        window.location.reload()
    }

    return (
        <div className="min-h-screen w-full overflow-hidden relative"
             style={{ background: '#0f0f1a' }}>
            <RibbonBackground idPrefix="db" animated />

            {/* Top bar */}
            <header className="relative z-10 flex items-center justify-between" style={{ padding: '1.5rem 2.5rem' }}>
                <div className="flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl"
                         style={{ background: 'linear-gradient(135deg, #00d4aa, #0891b2)' }}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>WindSpec</span>
                </div>
                <div className="flex items-center gap-2" style={{ marginTop: '0.25rem' }}>
                    <button
                        onClick={handleDashboard}
                        className="glass-button"
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                    >
                        Commands
                    </button>
                    <button
                        onClick={handleLogout}
                        className="glass-button"
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                    >
                        Sign out
                    </button>
                </div>
            </header>
        </div>
    )
}
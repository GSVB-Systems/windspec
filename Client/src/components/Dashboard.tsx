import { RibbonBackground } from './RibbonBackground'
import './LoginPage.css'

export const Dashboard = () => {
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
                <button
                    onClick={handleLogout}
                    className="glass-button"
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                >
                    Sign out
                </button>
            </header>

            {/* Main content */}
            <main className="relative z-10" style={{ padding: '1.5rem 2.5rem 2.5rem' }}>
                <h1 className="text-3xl font-bold text-white" style={{ marginBottom: '0.5rem' }}>Dashboard</h1>
                <p className="text-white/50" style={{ marginBottom: '2rem' }}>Wind Energy Management Platform</p>

                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
                    {[
                        { label: 'Active Turbines', value: '24', icon: '⚡' },
                        { label: 'Power Output', value: '1.8 GW', icon: '🔋' },
                        { label: 'Alerts', value: '3', icon: '⚠️' },
                        { label: 'Uptime', value: '99.2%', icon: '📊' },
                    ].map((stat) => (
                        <div key={stat.label} className="glass-card rounded-2xl" style={{ padding: '1.75rem' }}>
                            <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                                <span className="text-white/50 text-sm font-medium">{stat.label}</span>
                                <span className="text-lg">{stat.icon}</span>
                            </div>
                            <span className="text-3xl font-bold text-white">{stat.value}</span>
                        </div>
                    ))}
                </div>

                {/* Placeholder content area */}
                <div className="glass-card rounded-2xl" style={{ padding: '2.5rem' }}>
                    <h2 className="text-xl font-semibold text-white" style={{ marginBottom: '1rem' }}>Turbine Overview</h2>
                    <p className="text-white/40">Turbine monitoring data will appear here.</p>
                </div>
            </main>
        </div>
    )
}

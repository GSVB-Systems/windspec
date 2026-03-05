import { useMemo } from 'react'
import { RibbonBackground } from './RibbonBackground'
import { TelemetryChart } from './TelemetryChart'
import { AlertPanel } from './AlertPanel'
import { useTelemetry } from '../hooks/useTelemetry'
import { useAlert } from '../hooks/useAlert'
import './LoginPage.css'

export const Dashboard = () => {
    const { turbineMap, isConnected, error } = useTelemetry()
    const { alerts, isConnected: alertsConnected, error: alertError, dismissAlert, clearAlerts, severityCounts } = useAlert()

    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        window.location.reload()
    }

    /** Derived live stats – last point per turbine (already grouped) */
    const stats = useMemo(() => {
        const entries = [...turbineMap.values()]
        const uniqueTurbines = entries.length
        const latest = entries.map(g => g.points[g.points.length - 1]).filter(Boolean)
        const activeTurbines = latest.filter(
            t => t.status?.toLowerCase() === 'running' || t.status?.toLowerCase() === 'active'
        ).length
        const totalPower = latest.reduce((sum, t) => sum + (t.powerOutput ?? 0), 0)
        const avgWind = latest.length > 0
            ? latest.reduce((sum, t) => sum + (t.windSpeed ?? 0), 0) / latest.length
            : 0

        const alertTotal = alerts.length
        const criticalAlerts = severityCounts['critical'] ?? 0

        return [
            { label: 'Active Turbines', value: `${activeTurbines} / ${uniqueTurbines}`, icon: '⚡' },
            { label: 'Total Power', value: totalPower >= 1000 ? `${(totalPower / 1000).toFixed(1)} MW` : `${totalPower.toFixed(0)} kW`, icon: '🔋' },
            { label: 'Avg Wind Speed', value: `${avgWind.toFixed(1)} m/s`, icon: '🌬️' },
            { label: 'Alerts', value: criticalAlerts > 0 ? `${criticalAlerts} critical` : `${alertTotal}`, icon: criticalAlerts > 0 ? '🚨' : alertTotal > 0 ? '⚠️' : '✅' },
        ]
    }, [turbineMap, isConnected, alerts, severityCounts])

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

                {/* Error banners */}
                {error && (
                    <div className="glass-card rounded-xl" style={{
                        padding: '0.75rem 1.25rem',
                        marginBottom: '1.5rem',
                        borderColor: 'rgba(248,113,113,0.3)',
                    }}>
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}
                {alertError && (
                    <div className="glass-card rounded-xl" style={{
                        padding: '0.75rem 1.25rem',
                        marginBottom: '1.5rem',
                        borderColor: 'rgba(248,113,113,0.3)',
                    }}>
                        <p className="text-red-400 text-sm">{alertError}</p>
                    </div>
                )}

                {/* Live stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
                    {stats.map((stat) => (
                        <div key={stat.label} className="glass-card rounded-2xl" style={{ padding: '1.75rem' }}>
                            <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                                <span className="text-white/50 text-sm font-medium">{stat.label}</span>
                                <span className="text-lg">{stat.icon}</span>
                            </div>
                            <span className="text-3xl font-bold text-white">{stat.value}</span>
                        </div>
                    ))}
                </div>

                {/* Real-time telemetry chart */}
                <TelemetryChart turbineMap={turbineMap} isConnected={isConnected} />

                {/* Alerts panel */}
                <div style={{ marginTop: '2rem' }}>
                    <AlertPanel
                        alerts={alerts}
                        isConnected={alertsConnected}
                        severityCounts={severityCounts}
                        onDismiss={dismissAlert}
                        onClearAll={clearAlerts}
                    />
                </div>
            </main>
        </div>
    )
}

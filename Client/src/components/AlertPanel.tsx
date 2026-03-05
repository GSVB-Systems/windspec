import { useState, useMemo } from 'react'
import type { Alert } from '../models/ServerAPI'

/** Severity config: order, colour, icon */
const SEVERITY_CONFIG: Record<string, { order: number; bg: string; text: string; icon: string }> = {
    critical: { order: 0, bg: 'rgba(239,68,68,0.15)',  text: '#f87171', icon: '🔴' },
    high:     { order: 1, bg: 'rgba(251,146,60,0.15)', text: '#fb923c', icon: '🟠' },
    warning:  { order: 2, bg: 'rgba(250,204,21,0.15)', text: '#facc15', icon: '🟡' },
    medium:   { order: 2, bg: 'rgba(250,204,21,0.15)', text: '#facc15', icon: '🟡' },
    low:      { order: 3, bg: 'rgba(96,165,250,0.15)', text: '#60a5fa', icon: '🔵' },
    info:     { order: 4, bg: 'rgba(52,211,153,0.15)', text: '#34d399', icon: '🟢' },
}

const DEFAULT_SEV = { order: 5, bg: 'rgba(255,255,255,0.08)', text: '#a1a1aa', icon: '⚪' }

function getSevConfig(severity: string | undefined) {
    return SEVERITY_CONFIG[(severity ?? '').toLowerCase()] ?? DEFAULT_SEV
}

/** Time-ago helper */
function timeAgo(timestamp: string | undefined): string {
    if (!timestamp) return ''
    const diff = Date.now() - new Date(timestamp).getTime()
    if (diff < 60_000) return 'just now'
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
    return `${Math.floor(diff / 86_400_000)}d ago`
}

type SeverityFilter = 'all' | 'critical' | 'high' | 'warning' | 'medium' | 'low' | 'info'

interface AlertPanelProps {
    alerts: Alert[]
    isConnected: boolean
    severityCounts: Record<string, number>
    onDismiss: (id: string) => void
    onClearAll: () => void
}

export const AlertPanel = ({
    alerts,
    isConnected,
    severityCounts,
}: AlertPanelProps) => {
    const [filter, setFilter] = useState<SeverityFilter>('all')
    const [expanded, setExpanded] = useState<string | null>(null)

    /** Sorted & filtered alerts (newest first) */
    const displayed = useMemo(() => {
        let list = [...alerts]
        if (filter !== 'all') {
            list = list.filter(a => (a.severity ?? '').toLowerCase() === filter)
        }
        return list.sort((a, b) => {
            // Sort by severity order first, then by timestamp descending
            const sevA = getSevConfig(a.severity).order
            const sevB = getSevConfig(b.severity).order
            if (sevA !== sevB) return sevA - sevB
            return new Date(b.timestamp ?? 0).getTime() - new Date(a.timestamp ?? 0).getTime()
        })
    }, [alerts, filter])

    const total = alerts.length
    const criticalCount = severityCounts['critical'] ?? 0
    const highCount = severityCounts['high'] ?? 0

    return (
        <div className="glass-card rounded-2xl" style={{ padding: '2rem' }}>
            {/* Header */}
            <div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                style={{ marginBottom: '1.5rem' }}
            >
                <div>
                    <h2 className="text-xl font-semibold text-white">Alerts</h2>
                    <p className="text-white/40 text-sm" style={{ marginTop: '0.25rem' }}>
                        {isConnected ? (
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                Live &middot; {total} alert{total !== 1 && 's'}
                                {criticalCount > 0 && (
                                    <span className="text-red-400 font-medium ml-2">
                                        {criticalCount} critical
                                    </span>
                                )}
                                {highCount > 0 && (
                                    <span className="text-orange-400 font-medium ml-2">
                                        {highCount} high
                                    </span>
                                )}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                                Disconnected
                            </span>
                        )}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Severity filter */}
                    <div className="relative">
                        <select
                            value={filter}
                            onChange={e => setFilter(e.target.value as SeverityFilter)}
                            className="glass-input cursor-pointer"
                            style={{
                                padding: '0.6rem 2.5rem 0.6rem 1rem',
                                fontSize: '0.875rem',
                                appearance: 'none',
                                minWidth: '150px',
                            }}
                        >
                            <option value="all" style={{ background: '#1a1a2e', color: '#e0e0e0' }}>
                                All severities
                            </option>
                            {Object.keys(SEVERITY_CONFIG).map(sev => (
                                <option
                                    key={sev}
                                    value={sev}
                                    style={{ background: '#1a1a2e', color: '#e0e0e0' }}
                                >
                                    {sev.charAt(0).toUpperCase() + sev.slice(1)}{' '}
                                    ({severityCounts[sev] ?? 0})
                                </option>
                            ))}
                        </select>
                        <svg
                            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-white/40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    
                </div>
            </div>

            {/* Alert list */}
            {displayed.length === 0 ? (
                <div className="flex items-center justify-center" style={{ height: 200 }}>
                    <p className="text-white/30 text-sm">
                        {total === 0 ? 'No alerts yet' : 'No alerts match the selected filter'}
                    </p>
                </div>
            ) : (
                <div
                    className="flex flex-col"
                    style={{ gap: '0.75rem', maxHeight: '500px', overflowY: 'auto' }}
                >
                    {displayed.map(alert => {
                        const sev = getSevConfig(alert.severity)
                        const isExpanded = expanded === alert.id

                        return (
                            <div
                                key={alert.id ?? `${alert.turbineId}-${alert.timestamp}`}
                                className="glass-card rounded-xl transition-all duration-200"
                                style={{
                                    padding: '1rem 1.25rem',
                                    borderLeft: `3px solid ${sev.text}`,
                                    cursor: 'pointer',
                                }}
                                onClick={() =>
                                    setExpanded(isExpanded ? null : (alert.id ?? null))
                                }
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>
                                            {sev.icon}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span
                                                    className="text-xs font-semibold px-2 py-0.5 rounded-full uppercase"
                                                    style={{
                                                        background: sev.bg,
                                                        color: sev.text,
                                                        letterSpacing: '0.04em',
                                                    }}
                                                >
                                                    {alert.severity ?? 'unknown'}
                                                </span>
                                                {alert.turbineId && (
                                                    <span
                                                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                                                        style={{
                                                            background: 'rgba(255,255,255,0.08)',
                                                            color: 'rgba(255,255,255,0.7)',
                                                        }}
                                                    >
                                                        {alert.turbineId}
                                                    </span>
                                                )}
                                                <span className="text-white/50 text-xs">
                                                    {timeAgo(alert.timestamp)}
                                                </span>
                                            </div>
                                            <p
                                                className="text-sm text-white/90 font-medium"
                                                style={{
                                                    marginTop: '0.35rem',
                                                    overflow: 'hidden',
                                                    textOverflow: isExpanded
                                                        ? 'unset'
                                                        : 'ellipsis',
                                                    whiteSpace: isExpanded ? 'normal' : 'nowrap',
                                                }}
                                            >
                                                {alert.message}
                                            </p>

                                            {/* Expanded details */}
                                            {isExpanded && (
                                                <div
                                                    className="text-xs text-white/40"
                                                    style={{
                                                        marginTop: '0.5rem',
                                                        display: 'flex',
                                                        gap: '1rem',
                                                        flexWrap: 'wrap',
                                                    }}
                                                >
                                                    {alert.turbineId && (
                                                        <span>
                                                            Turbine:{' '}
                                                            <span className="text-white/60">
                                                                {alert.turbineId}
                                                            </span>
                                                        </span>
                                                    )}
                                                    {alert.farmId && (
                                                        <span>
                                                            Farm:{' '}
                                                            <span className="text-white/60">
                                                                {alert.farmId}
                                                            </span>
                                                        </span>
                                                    )}
                                                    {alert.timestamp && (
                                                        <span>
                                                            Time:{' '}
                                                            <span className="text-white/60">
                                                                {new Date(
                                                                    alert.timestamp
                                                                ).toLocaleString()}
                                                            </span>
                                                        </span>
                                                    )}
                                                    {alert.id && (
                                                        <span>
                                                            ID:{' '}
                                                            <span className="text-white/60">
                                                                {alert.id}
                                                            </span>
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

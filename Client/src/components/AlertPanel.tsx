import { useState, useMemo } from 'react'
import type { Alert } from '../models/ServerAPI'

const WARNING_VISUAL = {
    bg: 'rgba(250,204,21,0.15)',
    text: '#facc15',
    icon: '🟡',
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
    const [expanded, setExpanded] = useState<string | null>(null)

    /** Sorted warning alerts (newest first) */
    const displayed = useMemo(() => {
        return [...alerts]
            .filter(a => (a.severity ?? '').toLowerCase() === 'warning')
            .sort((a, b) => {
                // Sort newest first by timestamp
                return new Date(b.timestamp ?? 0).getTime() - new Date(a.timestamp ?? 0).getTime()
            })
    }, [alerts])

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

                
            </div>

            {/* Alert list */}
            {displayed.length === 0 ? (
                <div className="flex items-center justify-center" style={{ height: 200 }}>
                    <p className="text-white/30 text-sm">
                        {total === 0 ? 'No alerts yet' : 'No warning alerts available'}
                    </p>
                </div>
            ) : (
                <div
                    className="flex flex-col"
                    style={{ gap: '0.75rem', maxHeight: '500px', overflowY: 'auto' }}
                >
                    {displayed.map(alert => {
                        const severityLabel = alert.severity ?? 'warning'
                        const isExpanded = expanded === alert.id

                        return (
                            <div
                                key={alert.id ?? `${alert.turbineId}-${alert.timestamp}`}
                                className="glass-card rounded-xl transition-all duration-200"
                                style={{
                                    padding: '1rem 1.25rem',
                                    borderLeft: `3px solid ${WARNING_VISUAL.text}`,
                                    cursor: 'pointer',
                                }}
                                onClick={() =>
                                    setExpanded(isExpanded ? null : (alert.id ?? null))
                                }
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>
                                            {WARNING_VISUAL.icon}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span
                                                    className="text-xs font-semibold px-2 py-0.5 rounded-full uppercase"
                                                    style={{
                                                        background: WARNING_VISUAL.bg,
                                                        color: WARNING_VISUAL.text,
                                                        letterSpacing: '0.04em',
                                                    }}
                                                >
                                                    {severityLabel}
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

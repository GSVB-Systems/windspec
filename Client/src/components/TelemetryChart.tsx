import { useState, useMemo } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import type { Telemetry } from '../models/ServerAPI'
import type { TurbineMap } from '../hooks/useTelemetry'

/** Numeric telemetry fields available for charting */
const METRIC_OPTIONS: { key: keyof Telemetry; label: string; unit: string; color: string }[] = [
    { key: 'powerOutput',        label: 'Power Output',        unit: 'kW',  color: '#00d4aa' },
    { key: 'windSpeed',          label: 'Wind Speed',          unit: 'm/s', color: '#38bdf8' },
    { key: 'rotorSpeed',         label: 'Rotor Speed',         unit: 'RPM', color: '#f472b6' },
    { key: 'windDirection',      label: 'Wind Direction',      unit: '°',   color: '#facc15' },
    { key: 'ambientTemperature', label: 'Ambient Temperature', unit: '°C',  color: '#fb923c' },
    { key: 'nacelleDirection',   label: 'Nacelle Direction',   unit: '°',   color: '#a78bfa' },
    { key: 'bladePitch',         label: 'Blade Pitch',         unit: '°',   color: '#34d399' },
    { key: 'generatorTemp',      label: 'Generator Temp',      unit: '°C',  color: '#f87171' },
    { key: 'gearboxTemp',        label: 'Gearbox Temp',        unit: '°C',  color: '#fbbf24' },
    { key: 'vibration',          label: 'Vibration',           unit: 'mm/s',color: '#60a5fa' },
]

/** One colour per turbine slot (re-used cyclically) */
const TURBINE_COLORS = ['#00d4aa', '#38bdf8', '#f472b6', '#facc15', '#fb923c', '#a78bfa']

/** Time-range presets in minutes */
const TIME_RANGES: { label: string; minutes: number }[] = [
    { label: 'Last 10 min',   minutes: 10 },
    { label: 'Last hour',     minutes: 60 },
    { label: 'Last 12 hours', minutes: 720 },
    { label: 'Last 48 hours', minutes: 2880 },
    { label: 'Last week',     minutes: 10080 },
]

/** Format an epoch-ms timestamp for the X-axis tick depending on range */
function formatTick(epoch: number, rangeMinutes: number): string {
    const d = new Date(epoch)
    if (rangeMinutes <= 60) {
        // Short ranges: just time
        return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }
    if (rangeMinutes <= 2880) {
        // Up to 48 h: day + time (no seconds)
        return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`
    }
    // Weeks: date only
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

/** Format an epoch-ms timestamp for the tooltip (always full) */
function formatTooltipLabel(epoch: number): string {
    const d = new Date(epoch)
    return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ${d.toLocaleTimeString()}`
}

interface TelemetryChartProps {
    turbineMap: TurbineMap
    isConnected: boolean
    onTurbineClick?: (turbineId: string) => void
}

export const TelemetryChart = ({ turbineMap, isConnected, onTurbineClick }: TelemetryChartProps) => {
    const [selectedMetric, setSelectedMetric] = useState<keyof Telemetry>('powerOutput')
    const [rangeMinutes, setRangeMinutes] = useState(60) // default: last hour

    const metric = METRIC_OPTIONS.find(m => m.key === selectedMetric) ?? METRIC_OPTIONS[0]

    /** Sorted entries filtered to the selected time window */
    const turbineGroups = useMemo(() => {
        const cutoff = Date.now() - rangeMinutes * 60_000
        return [...turbineMap.entries()]
            .map(([id, group]) => {
                const filtered = group.points.filter(
                    t => new Date(t.timestamp ?? 0).getTime() >= cutoff
                )
                return [id, { ...group, points: filtered }] as const
            })
            .sort(([a], [b]) => a.localeCompare(b))
    }, [turbineMap, rangeMinutes])

    return (
        <div className="glass-card rounded-2xl" style={{ padding: '2rem' }}>
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                 style={{ marginBottom: '1.5rem' }}>
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        Real-Time Telemetry
                    </h2>
                    <p className="text-white/40 text-sm" style={{ marginTop: '0.25rem' }}>
                        {isConnected ? (
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                Live &middot; {turbineGroups.length} turbine{turbineGroups.length !== 1 && 's'}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                                Disconnected
                            </span>
                        )}
                    </p>
                </div>

                {/* Dropdowns */}
                <div className="flex items-center gap-3">
                    {/* Time range dropdown */}
                    <div className="relative">
                        <select
                            value={rangeMinutes}
                            onChange={e => setRangeMinutes(Number(e.target.value))}
                            className="glass-input cursor-pointer"
                            style={{
                                padding: '0.6rem 2.5rem 0.6rem 1rem',
                                fontSize: '0.875rem',
                                appearance: 'none',
                                minWidth: '150px',
                            }}
                        >
                            {TIME_RANGES.map(opt => (
                                <option
                                    key={opt.minutes}
                                    value={opt.minutes}
                                    style={{ background: '#1a1a2e', color: '#e0e0e0' }}
                                >
                                    {opt.label}
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

                    {/* Metric dropdown */}
                    <div className="relative">
                        <select
                            value={selectedMetric as string}
                            onChange={e => setSelectedMetric(e.target.value as keyof Telemetry)}
                            className="glass-input cursor-pointer"
                            style={{
                                padding: '0.6rem 2.5rem 0.6rem 1rem',
                                fontSize: '0.875rem',
                                appearance: 'none',
                                minWidth: '200px',
                            }}
                        >
                            {METRIC_OPTIONS.map(opt => (
                                <option
                                    key={opt.key}
                                    value={opt.key}
                                    style={{ background: '#1a1a2e', color: '#e0e0e0' }}
                                >
                                    {opt.label} ({opt.unit})
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

            {/* One chart per turbine */}
            {turbineGroups.length === 0 ? (
                <div className="flex items-center justify-center" style={{ height: 300 }}>
                    <p className="text-white/30 text-sm">Waiting for telemetry data...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '1.5rem' }}>
                    {turbineGroups.map(([turbineId, { name, points }], idx) => {
                        const color = TURBINE_COLORS[idx % TURBINE_COLORS.length]
                        const chartData = points
                            .filter(t => t[selectedMetric] !== undefined && t[selectedMetric] !== null && t.timestamp)
                            .map(t => ({
                                ts: new Date(t.timestamp!).getTime(),
                                value: t[selectedMetric] as number,
                            }))

                        const lastPoint = points[points.length - 1]
                        const status = lastPoint?.status ?? 'unknown'

                        return (
                            <div key={turbineId} className="glass-card rounded-xl" style={{ padding: '1.25rem' }}>
                                <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                                    <div>
                                        <h3
                                            className="text-sm font-semibold text-white cursor-pointer hover:text-teal-400 transition-colors"
                                            onClick={() => onTurbineClick?.(turbineId)}
                                            title="Click to send command"
                                        >
                                            {name}
                                        </h3><span className="text-xs text-white/35">{turbineId}</span>
                                    </div>
                                    <span
                                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                                        style={{
                                            background: status.toLowerCase() === 'running' || status.toLowerCase() === 'active'
                                                ? 'rgba(52,211,153,0.15)'
                                                : 'rgba(251,191,36,0.15)',
                                            color: status.toLowerCase() === 'running' || status.toLowerCase() === 'active'
                                                ? '#34d399'
                                                : '#fbbf24',
                                        }}
                                    >
                                        {status}
                                    </span>
                                </div>

                                {chartData.length === 0 ? (
                                    <div className="flex items-center justify-center" style={{ height: 180 }}>
                                        <p className="text-white/25 text-xs">No {metric.label} data</p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                            <XAxis
                                                dataKey="ts"
                                                type="number"
                                                scale="time"
                                                domain={['dataMin', 'dataMax']}
                                                stroke="rgba(255,255,255,0.2)"
                                                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }}
                                                tickFormatter={(v: number) => formatTick(v, rangeMinutes)}
                                                minTickGap={30}
                                            />
                                            <YAxis
                                                stroke="rgba(255,255,255,0.2)"
                                                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                                                width={45}
                                                label={{
                                                    value: metric.unit,
                                                    angle: -90,
                                                    position: 'insideLeft',
                                                    fill: 'rgba(255,255,255,0.3)',
                                                    style: { fontSize: 10 },
                                                }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    background: 'rgba(15, 15, 26, 0.95)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 8,
                                                    color: '#e0e0e0',
                                                    fontSize: 12,
                                                }}
                                                formatter={(value) => [`${value} ${metric.unit}`, metric.label]}
                                                labelFormatter={(v) => formatTooltipLabel(v as number)}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                name={metric.label}
                                                stroke={color}
                                                strokeWidth={2}
                                                dot={false}
                                                activeDot={{ r: 4, stroke: color, strokeWidth: 2, fill: '#0f0f1a' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

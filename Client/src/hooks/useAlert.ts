import { useEffect, useRef, useState, useCallback } from 'react'
import { realtimeClient } from '../api-clients'
import type { Alert } from '../models/ServerAPI'

const SSE_URL = 'http://localhost:5031/sse'

/** Max alerts kept in state */
const MAX_ALERTS = 200
/** How often (ms) the buffered data is flushed to React state */
const FLUSH_INTERVAL = 500

/** Insert an alert into the buffer, keeping the list capped at MAX_ALERTS */
function insertAlert(list: Alert[], alert: Alert): Alert[] {
    list.push(alert)
    if (list.length > MAX_ALERTS) {
        return list.slice(-MAX_ALERTS)
    }
    return list
}

export const useAlert = () => {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [isConnected, setIsConnected] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Mutable buffer – written by SSE callbacks, flushed on interval
    const bufferRef = useRef<Alert[]>([])
    const dirtyRef = useRef(false)
    const eventSourceRef = useRef<EventSource | null>(null)

    const connect = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close()
        }

        setError(null)
        const es = new EventSource(SSE_URL)
        eventSourceRef.current = es

        es.onopen = () => setIsConnected(true)

        es.onerror = () => {
            setIsConnected(false)
            setError('SSE connection lost. Reconnecting...')
        }

        es.addEventListener('connected', async (event: MessageEvent) => {
            let connectionId = event.data
            try {
                const parsed = JSON.parse(connectionId)
                if (parsed?.connectionId) connectionId = parsed.connectionId
            } catch { /* plain string – use as-is */ }
            try {
                const response = await realtimeClient.getAlert(connectionId)
                if (response.data) {
                    const initial = response.data.sort(
                        (a, b) =>
                            new Date(a.timestamp ?? 0).getTime() -
                            new Date(b.timestamp ?? 0).getTime()
                    )
                    bufferRef.current = initial.slice(-MAX_ALERTS)
                    dirtyRef.current = true
                }
            } catch (err) {
                setError(`Failed to subscribe to alerts: ${(err as Error).message}`)
            }
        })

        es.addEventListener('alerts', (event: MessageEvent) => {
            handleUpdate(event.data)
        })

        // Some StateleSSE versions send group updates as default "message"
        // events, or wrapped: {"group":"…","data":…}
        es.onmessage = (event: MessageEvent) => {
            handleUpdate(event.data)
        }

        function handleUpdate(raw: string) {
            try {
                const parsed = JSON.parse(raw)
                // Unwrap if the library wraps: { group: "alerts", data: {...} }
                const payload: Alert =
                    parsed?.data && parsed?.group === 'alerts' ? parsed.data : parsed
                if (payload && (payload.turbineId || payload.id)) {
                    bufferRef.current = insertAlert(bufferRef.current, payload)
                    dirtyRef.current = true
                }
            } catch {
                // Ignore non-JSON (e.g. the connectionId string from "connected")
            }
        }
    }, [])

    // Flush buffer → React state on a fixed interval
    useEffect(() => {
        const id = setInterval(() => {
            if (dirtyRef.current) {
                dirtyRef.current = false
                setAlerts([...bufferRef.current])
            }
        }, FLUSH_INTERVAL)
        return () => clearInterval(id)
    }, [])

    useEffect(() => {
        connect()
        return () => {
            eventSourceRef.current?.close()
        }
    }, [connect])

    /** Dismiss an alert by id (client-side only) */
    const dismissAlert = useCallback((alertId: string) => {
        bufferRef.current = bufferRef.current.filter(a => a.id !== alertId)
        dirtyRef.current = true
    }, [])

    /** Clear all alerts (client-side only) */
    const clearAlerts = useCallback(() => {
        bufferRef.current = []
        dirtyRef.current = true
    }, [])

    /** Count alerts grouped by severity */
    const severityCounts = alerts.reduce<Record<string, number>>((acc, a) => {
        const sev = (a.severity ?? 'unknown').toLowerCase()
        acc[sev] = (acc[sev] ?? 0) + 1
        return acc
    }, {})

    return { alerts, isConnected, error, dismissAlert, clearAlerts, severityCounts }
}

import { useEffect, useRef, useState, useCallback } from 'react'
import { realtimeClient } from '../api-clients'
import type { Telemetry } from '../models/ServerAPI'

const SSE_URL = 'http://localhost:5031/sse'

/** Max data points kept per turbine */
const MAX_POINTS = 500
/** How often (ms) the buffered data is flushed to React state */
const FLUSH_INTERVAL = 500

export type TurbineGroup = { name: string; points: Telemetry[] }
export type TurbineMap = Map<string, TurbineGroup>

/** Insert a telemetry reading into the grouped map, capping at MAX_POINTS */
function insertIntoMap(map: TurbineMap, t: Telemetry) {
    const id = t.turbineId ?? 'unknown'
    let group = map.get(id)
    if (!group) {
        group = { name: t.turbineName ?? id, points: [] }
        map.set(id, group)
    }
    group.points.push(t)
    if (group.points.length > MAX_POINTS) {
        group.points = group.points.slice(-MAX_POINTS)
    }
}

export const useTelemetry = () => {
    const [turbineMap, setTurbineMap] = useState<TurbineMap>(new Map())
    const [isConnected, setIsConnected] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Mutable buffer – written by SSE callbacks, flushed on interval
    const bufferRef = useRef<TurbineMap>(new Map())
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
            const connectionId = event.data
            try {
                const response = await realtimeClient.getTelemetry(connectionId)
                if (response.data) {
                    const map = new Map<string, TurbineGroup>()
                    for (const t of response.data) {
                        insertIntoMap(map, t)
                    }
                    // Sort each turbine's backlog by timestamp once
                    for (const group of map.values()) {
                        group.points.sort((a, b) =>
                            new Date(a.timestamp ?? 0).getTime() - new Date(b.timestamp ?? 0).getTime()
                        )
                        if (group.points.length > MAX_POINTS) {
                            group.points = group.points.slice(-MAX_POINTS)
                        }
                    }
                    bufferRef.current = map
                    dirtyRef.current = true
                }
            } catch (err) {
                setError(`Failed to subscribe to telemetry: ${(err as Error).message}`)
            }
        })

        es.addEventListener('telemetry', (event: MessageEvent) => {
            handleUpdate(event.data)
        })

        // Some StateleSSE versions send group updates as default "message"
        // events (no explicit event: field), or wrapped: {"group":"…","data":…}
        es.onmessage = (event: MessageEvent) => {
            handleUpdate(event.data)
        }

        function handleUpdate(raw: string) {
            try {
                const parsed = JSON.parse(raw)
                // Unwrap if the library wraps: { group: "telemetry", data: {...} }
                const payload: Telemetry = parsed?.data && parsed?.group ? parsed.data : parsed
                if (payload && (payload.turbineId || payload.id)) {
                    insertIntoMap(bufferRef.current, payload)
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
                // Deep-clone groups so buffer and state are fully independent –
                // prevents shared-reference mutations from hiding updates.
                const snapshot = new Map<string, TurbineGroup>()
                for (const [tid, group] of bufferRef.current) {
                    snapshot.set(tid, { name: group.name, points: [...group.points] })
                }
                setTurbineMap(snapshot)
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

    return { turbineMap, isConnected, error }
}

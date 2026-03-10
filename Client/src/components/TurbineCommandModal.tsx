import { useCommands } from "../hooks/useCommands.ts";

interface TurbineCommandModalProps {
    farmId: string
    turbineId: string
    onClose: () => void
}

export function TurbineCommandModal({ farmId, turbineId, onClose }: TurbineCommandModalProps) {
    const { selected, paramValue, setParamValue, confirmed, COMMANDS, handleSelect, handleSend } = useCommands();



    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="glass-card rounded-2xl w-full max-w-md"
                style={{ padding: '2rem', margin: '1rem' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
                    <div>
                        <h2 className="text-xl font-bold text-white">Turbine Control</h2>
                        <p className="text-white/50 text-sm" style={{ marginTop: '0.2rem' }}>
                            ID: <span className="text-white/70 font-mono">{turbineId}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white/80 text-2xl leading-none" aria-label="Close">
                        ×
                    </button>
                </div>

                {/* Command list */}
                <div className="flex flex-col" style={{ gap: '0.6rem', marginBottom: '1.5rem' }}>
                    {COMMANDS.map(cmd => (
                        <div key={cmd.id}>
                            <button
                                onClick={() => handleSelect(cmd.id)}
                                className="flex items-center gap-3 rounded-xl text-left transition-all w-full"
                                style={{
                                    padding: '0.85rem 1rem',
                                    background: selected === cmd.id ? 'rgba(0, 212, 170, 0.15)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${selected === cmd.id ? 'rgba(0,212,170,0.5)' : 'rgba(255,255,255,0.08)'}`,
                                }}
                            >
                                <span className="text-lg">{cmd.icon}</span>
                                <div>
                                    <p className="text-white text-sm font-medium">{cmd.label}</p>
                                    <p className="text-white/40 text-xs">{cmd.description}</p>
                                </div>
                                {selected === cmd.id && <span className="ml-auto text-teal-400 text-sm">✓</span>}
                            </button>

                            {selected === cmd.id && cmd.paramField && (
                                <div style={{ padding: '0.6rem 0.25rem 0.1rem' }}>
                                    <label className="text-white/50 text-xs" style={{ display: 'block', marginBottom: '0.3rem' }}>
                                        {cmd.paramField.label}
                                    </label>
                                    <input
                                        type={cmd.paramField.type}
                                        value={paramValue}
                                        onChange={e => setParamValue(e.target.value)}
                                        className="glass-input w-full"
                                        style={{ padding: '0.55rem 0.85rem', fontSize: '0.875rem' }}
                                        autoFocus
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <button
                    onClick={() => handleSend(farmId, turbineId, onClose)}
                    disabled={!selected || confirmed}
                    className="glass-button w-full"
                    style={{
                        padding: '0.75rem',
                        opacity: !selected || confirmed ? 0.4 : 1,
                        background: confirmed ? 'rgba(0,212,170,0.2)' : undefined,
                    }}
                >
                    {confirmed ? '✅ Command sent' : 'Send Command'}
                </button>
            </div>
        </div>
    );
}

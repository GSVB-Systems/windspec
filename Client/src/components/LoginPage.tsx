import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLogin } from '../hooks/useLogin'
import type { LoginRequestDTO } from '../models/ServerAPI'
import './LoginPage.css'
import { RibbonBackground } from './RibbonBackground'

export const LoginPage = () => {
    const { login, isLoading, error, token } = useLogin()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const request: LoginRequestDTO = {
            username,
            password,
        }

        await login(request)
    }

    if (token) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center overflow-hidden relative"
                 style={{ background: '#0f0f1a' }}>
                {/* Ribbon background */}
                <RibbonBackground idPrefix="r" />

                <div className="relative z-10 w-full max-w-md mx-auto px-4">
                    <div className="glass-card rounded-3xl p-10 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                             style={{ background: 'linear-gradient(135deg, #00d4aa, #0891b2)' }}>
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
                        <p className="text-white/60 mb-8">You have been authenticated successfully</p>
                        <div className="flex items-center justify-center">
                            <div className="spinner" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden relative p-4"
             style={{ background: '#0f0f1a' }}>
            {/* Ribbon background */}
            <RibbonBackground idPrefix="rb" animated />

            {/* Main content */}
            <div className="relative z-10 w-full max-w-md">
                {/* Logo/Title */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-lg"
                         style={{ background: 'linear-gradient(135deg, #00d4aa, #0891b2)' }}>
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-2" style={{ letterSpacing: '-0.02em' }}>WindSpec</h1>
                    <p className="text-white/50 text-lg">Wind Energy Management Platform</p>
                </div>

                {/* Glass login card */}
                <div className="glass-card rounded-3xl relative overflow-hidden" style={{ padding: '2.5rem' }}>
                    {/* Inner glow */}
                    <div className="absolute inset-0 rounded-3xl pointer-events-none"
                         style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,212,170,0.04) 100%)' }} />

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white" style={{ marginBottom: '1.75rem' }}>Sign in to your account</h2>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Username field */}
                            <div>
                                <label className="block text-white/70 text-sm font-medium" style={{ marginBottom: '0.5rem' }}>
                                    Username
                                </label>
                                <div className="relative group">
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="username"
                                        disabled={isLoading}
                                        required
                                        className="glass-input"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <svg className="w-5 h-5 text-white/30 group-focus-within:text-[#00d4aa] transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Password field */}
                            <div>
                                <label className="block text-white/70 text-sm font-medium" style={{ marginBottom: '0.5rem' }}>
                                    Password
                                </label>
                                <div className="relative group">
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                        required
                                        className="glass-input"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <svg className="w-5 h-5 text-white/30 group-focus-within:text-[#00d4aa] transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="rounded-xl p-4 flex items-start gap-3 backdrop-blur-sm"
                                     style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm" style={{ color: '#fca5a5' }}>{error}</span>
                                </div>
                            )}

                            {/* Submit button */}
                            <div className="flex justify-center" style={{ paddingTop: '1rem' }}>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="glass-button group"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="spinner-sm" />
                                            <span>Signing in...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign in</span>
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLogin } from '../hooks/useLogin'
import type { LoginRequestDTO } from '../models/ServerAPI'

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
            <div className="min-h-screen w-full flex items-center justify-center bg-base-100 overflow-hidden relative">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob opacity-70"></div>
                    <div className="absolute top-1/4 right-0 w-80 h-80 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 opacity-70"></div>
                    <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 opacity-70"></div>
                </div>

                <div className="relative z-10 w-full max-w-md mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6 shadow-lg">
                            <svg className="w-8 h-8 text-primary-content" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-4xl font-bold text-base-content mb-2">Welcome Back!</h2>
                        <p className="text-base-content/70">You have been authenticated successfully</p>
                    </div>

                    <div className="bg-base-100 rounded-3xl p-8 border border-base-300 shadow-2xl">
                        <div className="text-center">
                            <p className="text-base-content/80 mb-6 text-lg">Your session is ready</p>
                            <div className="flex items-center justify-center">
                                <span className="loading loading-dots loading-lg text-primary"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-base-100 overflow-hidden relative p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob opacity-70"></div>
                <div className="absolute top-1/4 right-0 w-80 h-80 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 opacity-70"></div>
                <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 opacity-70"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-6000"></div>
            </div>

            {/* Animated grid background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base-300/20"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-md">
                {/* Logo/Title */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6 shadow-lg hover:shadow-xl transition-shadow">
                        <svg className="w-8 h-8 text-primary-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-bold text-base-content mb-2">WindSpec</h1>
                    <p className="text-base-content/70 text-lg">Wind Energy Management Platform</p>
                </div>

                {/* Login card */}
                <div className="bg-base-100 rounded-3xl p-8 border border-base-300 shadow-2xl relative overflow-hidden">
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none rounded-3xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-base-content mb-8">Sign in to your account</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username field */}
                            <div>
                                <label className="block text-base-content/90 text-sm font-semibold mb-3">
                                    Username
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-300 pointer-events-none"></div>
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="your.username"
                                        disabled={isLoading}
                                        required
                                        className="relative w-full px-5 py-3 bg-base-200/50 border border-base-300 rounded-xl text-base-content placeholder-base-content/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <svg className="w-5 h-5 text-base-content/40 group-focus-within:text-primary transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Password field */}
                            <div>
                                <label className="block text-base-content/90 text-sm font-semibold mb-3">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-300 pointer-events-none"></div>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                        required
                                        className="relative w-full px-5 py-3 bg-base-200/50 border border-base-300 rounded-xl text-base-content placeholder-base-content/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <svg className="w-5 h-5 text-base-content/40 group-focus-within:text-primary transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="bg-error/20 border border-error/50 rounded-xl p-4 flex items-start gap-3 animate-pulse backdrop-blur-sm">
                                    <svg className="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-error text-sm">{error}</span>
                                </div>
                            )}

                            {/* Submit button */}
                            <div className="flex justify-center pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-8 py-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-content font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 group hover:scale-105 active:scale-95"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="loading loading-spinner loading-xs"></span>
                                            <span className="text-sm">Signing in...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-sm">Sign in</span>
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Remember me and forgot password */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-base-300">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded bg-base-200 border-base-300 checked:bg-primary accent-primary" />
                                <span className="text-sm text-base-content/60 group-hover:text-base-content/90 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                                Forgot password?
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-base-content/60 text-sm">
                        Don't have an account?{' '}
                        <a href="#" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                            Sign up for free
                        </a>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .animation-delay-6000 {
                    animation-delay: 6s;
                }
            `}</style>
        </div>
    )
}








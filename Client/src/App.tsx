import { useEffect, useState } from 'react'
import { LoginPage } from './components/LoginPage'
import { Dashboard } from './components/Dashboard'

export const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('accessToken')
            setIsAuthenticated(!!token)
        }

        checkAuth()

        window.addEventListener('storage', checkAuth)

        // localStorage events don't fire in the same tab, so poll briefly
        const interval = setInterval(checkAuth, 500)

        return () => {
            window.removeEventListener('storage', checkAuth)
            clearInterval(interval)
        }
    }, [])

    if (isAuthenticated) {
        return <Dashboard />
    }

    return <LoginPage />
}


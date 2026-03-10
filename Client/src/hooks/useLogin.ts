import { useCallback, useState } from 'react'
import { userClient } from "../api-clients.ts";
import type { LoginRequestDTO } from "../models/ServerAPI.ts";
import { useNavigate } from "react-router";
import { useAtom } from "jotai";
import { tokenAtom } from "../atoms/token.ts";

type UseLoginResult = {
    login: (request: LoginRequestDTO) => Promise<void>
    isLoading: boolean
    error: string | null
    token: string | null
}

export const useLogin = (): UseLoginResult => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [token, setToken] = useAtom(tokenAtom)
    const navigate = useNavigate();

    const login = useCallback(async (request: LoginRequestDTO) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await userClient.login(request)
            const tokenText = await response.data.text()
            setToken(tokenText)
            navigate('/')
        } catch (err) {
            const message = (err as Error).message ?? 'Login failed.'
            setError(message)
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        login,
        isLoading,
        error,
        token
    }
}

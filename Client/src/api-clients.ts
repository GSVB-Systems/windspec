import {TOKEN_KEY, tokenStorage} from "./atoms/token.ts";
import {RealTimeClient, UserClient} from "./models/ServerAPI.ts";

const customFetch = async (url: RequestInfo, init?: RequestInit) => {
    const token = tokenStorage.getItem(TOKEN_KEY, null);

    if (token) {
        // Copy of existing init or new object, with copy of existing headers or
        // new object including Bearer token.
        init = {
            ...(init ?? {}),
            headers: {
                ...(init?.headers ?? {}),
                Authorization: `Bearer ${token}`,
            },
        };
    }
    return await fetch(url, init);
};

const baseUrl = "http://localhost:5031";
export const realtimeClient = new RealTimeClient(baseUrl, {fetch: customFetch});
export const userClient = new UserClient(baseUrl, {fetch: customFetch});

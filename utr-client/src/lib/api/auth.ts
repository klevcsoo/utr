import {serverURL} from "../config";
import {UserRole} from "../../types/UserRole";
import {createContext} from "react";
import {DisplayedUser} from "../../types/DisplayedUser";
import {UserCreationData} from "../../types/request/UserCreationData";
import {MessageResponse} from "../../types/response/MessageResponse";
import {UserEditData} from "../../types/request/UserEditData";
import {apiRequest} from "./http";
import {UserRecord} from "../../types/UserRecord";

// noinspection JSUnusedGlobalSymbols
export const
    ACCESS_LEVEL_SPEAKER = 1,
    ACCESS_LEVEL_IDOROGZITO = 2,
    ACCESS_LEVEL_ALLITOBIRO = 4,
    ACCESS_LEVEL_ADMIN = 8;

export const AuthContext = createContext<{
    user: UserRecord | undefined
    login(username: string, password: string): Promise<void>
    logout(): Promise<void>
}>({
    user: undefined,
    async login() {
    },
    logout: logout
});

export async function login(role: UserRole, password: string) {
    const response = await fetch(`${serverURL}/api/v2/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": role,
            "password": password
        }),
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error(`Login failed ${await response.text()}`);
    }

    return await response.json() as UserRecord;
}

export async function logout() {
    sessionStorage.removeItem("auth_data");
}

export async function getMe() {
    return apiRequest<DisplayedUser>("auth/users/me", "GET");
}

export async function getAllUsers() {
    return apiRequest<DisplayedUser[]>("/auth/users/", "GET");
}

export async function getUser(id: number) {
    return apiRequest<DisplayedUser>(`/auth/users/${id}`, "GET");
}

export async function createUser(data: UserCreationData) {
    const locale = window.localStorage.getItem("locale") ?? "hu";

    const response: MessageResponse = await fetch(`${serverURL}/api/v2/auth/users/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept-Language": locale
        },
        body: JSON.stringify(data)
    }).then(res => res.json());

    return response;
}

export async function deleteUser(id: number) {
    return apiRequest(`/auth/users/${id}`, "DELETE");
}

export async function editUser(id: number, options: UserEditData) {
    const messages: MessageResponse[] = [];

    if (!!options.roles) {
        const params = new URLSearchParams();
        options.roles.forEach(role => params.append("role", role));
        messages.push(await apiRequest(`/auth/users/${id}/roles?${params}`, "PATCH"));
    }

    if (!!options.displayName) {
        const params = new URLSearchParams({displayName: options.displayName});
        messages.push(await apiRequest(`/auth/users/${id}/display-name?${params}`, "PATCH"));
    }

    if (!!options.password) {
        const locale = window.localStorage.getItem("locale") ?? "hu";
        const url = `${serverURL}/api/v2/auth/users/${id}/password`;
        const response: MessageResponse = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": locale
            },
            body: JSON.stringify(options.password)
        }).then(res => res.json());

        messages.push(response);
    }

    return messages;
}

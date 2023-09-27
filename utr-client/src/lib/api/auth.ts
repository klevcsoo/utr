import {serverURL} from "../config";
import {UserRole} from "../../types/UserRole";
import {AuthUser} from "../../types/AuthUser";
import {createContext} from "react";
import {DisplayedUser} from "../../types/DisplayedUser";
import {UserCreationData} from "../../types/request/UserCreationData";
import {MessageResponse} from "../../types/response/MessageResponse";
import {UserEditData} from "../../types/request/UserEditData";
import {apiRequest} from "./http";
import {UserRecord} from "../../types/UserRecord";

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
    return apiRequest<DisplayedUser>(null, "auth/users/me", "GET");
}

export async function getAllUsers(user: AuthUser) {
    return apiRequest<DisplayedUser[]>(user, "/auth/users/", "GET");
}

export async function getUser(user: AuthUser, id: number) {
    return apiRequest<DisplayedUser>(user, `/auth/users/${id}`, "GET");
}

export async function createUser(user: AuthUser, data: UserCreationData) {
    const locale = window.localStorage.getItem("locale") ?? "hu";

    const response: MessageResponse = await fetch(`${serverURL}/api/v2/auth/users/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authentication": `Bearer ${user.jwtToken}`,
            "Accept-Language": locale
        },
        body: JSON.stringify(data)
    }).then(res => res.json());

    return response;
}

export async function deleteUser(user: AuthUser, id: number) {
    return apiRequest(user, `/auth/users/${id}`, "DELETE");
}

export async function editUser(user: AuthUser, id: number, options: UserEditData) {
    const messages: MessageResponse[] = [];

    if (!!options.roles) {
        const params = new URLSearchParams();
        options.roles.forEach(role => params.append("role", role));
        messages.push(await apiRequest(user, `/auth/users/${id}/roles?${params}`, "PATCH"));
    }

    if (!!options.displayName) {
        const params = new URLSearchParams({displayName: options.displayName});
        messages.push(await apiRequest(user, `/auth/users/${id}/display-name?${params}`, "PATCH"));
    }

    if (!!options.password) {
        const locale = window.localStorage.getItem("locale") ?? "hu";
        const url = `${serverURL}/api/v2/auth/users/${id}/password`;
        const response: MessageResponse = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authentication": `Bearer ${user.jwtToken}`,
                "Accept-Language": locale
            },
            body: JSON.stringify(options.password)
        }).then(res => res.json());

        messages.push(response);
    }

    return messages;
}

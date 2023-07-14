import {serverURL} from "../config";
import {UserRole} from "../types/UserRole";
import {LoginResponse} from "../types/response/LoginResponse";
import {UserDetails} from "../types/UserDetails";
import {createContext} from "react";
import {apiRequest} from "../utils";
import {DisplayedUser} from "../types/DisplayedUser";
import {UserCreationData} from "../types/request/UserCreationData";
import {MessageResponse} from "../types/response/MessageResponse";
import {UserEditData} from "../types/request/UserEditData";

const userRoleMap: { [key: string]: UserRole } = {
    "ROLE_ADMIN": "admin",
    "ROLE_ALLITOBIRO": "allitobiro",
    "ROLE_IDOROGZITO": "idorogzito",
    "ROLE_SPEAKER": "speaker",
};

let userDetails: UserDetails;
export const AuthContext = createContext<{
    user: UserDetails | undefined
    login(username: string, password: string): Promise<UserDetails>
    logout(): Promise<void>
}>({user: undefined, login: login, logout: logout});

export async function login(role: UserRole, password: string): Promise<UserDetails> {
    const response: LoginResponse = await fetch(`${serverURL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": role,
            "password": password
        })
    }).then(res => res.json());

    userDetails = {
        displayName: response.displayName,
        roles: response.roles.map(role => userRoleMap[role]),
        id: response.id,
        jwtToken: response.token
    };

    return {...userDetails};
}

export async function logout() {
    sessionStorage.removeItem("auth_data");
}

export async function getAllUsers(user: UserDetails) {
    return apiRequest<DisplayedUser[]>(user, "/auth/users/", "GET");
}

export async function getUser(user: UserDetails, id: number) {
    return apiRequest<DisplayedUser>(user, `/auth/users/${id}`, "GET");
}

export async function createUser(user: UserDetails, data: UserCreationData) {
    const locale = window.localStorage.getItem("locale") ?? "hu";

    const response: MessageResponse = await fetch(`${serverURL}/api/auth/users/`, {
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

export async function deleteUser(user: UserDetails, id: number) {
    return apiRequest(user, `/auth/users/${id}`, "DELETE");
}

export async function editUser(user: UserDetails, id: number, options: UserEditData) {
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
        const url = `${serverURL}/api/auth/users/${id}/password`;
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

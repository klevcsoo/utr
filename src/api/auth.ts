import {serverURL} from "../config";
import {UserRole} from "../types/UserRole";
import {LoginResponse} from "../types/LoginResponse";
import {UserDetails} from "../types/UserDetails";
import {createContext} from "react";

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
    logout(): void
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

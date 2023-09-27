import {AuthUser} from "../types/AuthUser";
import {apiRequest} from "../lib/api/http";

export async function getApiServerEnvVars(user: AuthUser) {
    return apiRequest<{ [key: string]: string }>(user, "/support/env", "GET");
}

export async function getApiServerLog(user: AuthUser) {
    return apiRequest<string[]>(user, "/support/log", "GET");
}

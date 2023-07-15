import {apiRequest} from "../utils";
import {AuthUser} from "../types/AuthUser";

export async function getApiServerEnvVars(user: AuthUser) {
    return apiRequest<{ [key: string]: string }>(user, "/support/env", "GET");
}

export async function getApiServerLog(user: AuthUser) {
    return apiRequest<string[]>(user, "/support/log", "GET");
}

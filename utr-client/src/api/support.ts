import {apiRequest} from "../utils";
import {UserDetails} from "../types/UserDetails";

export async function getApiServerEnvVars(user: UserDetails) {
    return apiRequest<{ [key: string]: string }>(user, "/support/env", "GET");
}

export async function getApiServerLog(user: UserDetails) {
    return apiRequest<string[]>(user, "/support/log", "GET");
}

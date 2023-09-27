import {apiRequest} from "../lib/api/http";

export async function getApiServerEnvVars() {
    return apiRequest<{ [key: string]: string }>("/support/env", "GET");
}

export async function getApiServerLog() {
    return apiRequest<string[]>("/support/log", "GET");
}

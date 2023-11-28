import {apiRequest} from "../utils/lib/utils";

import {AuthUser} from "../auth/types";

export async function getApiServerEnvVars(user: AuthUser) {
    return apiRequest<{ [key: string]: string }>(user, "/support/env", "GET");
}

export async function getApiServerLog(user: AuthUser) {
    return apiRequest<string[]>(user, "/support/log", "GET");
}

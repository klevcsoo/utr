import {apiRequest} from "../utils/lib/utils";
import {Csapat} from "./types";
import {MessageResponse} from "../utils/types";
import {AuthUser} from "../auth/types";

export async function getAllCsapatokList(user: AuthUser): Promise<Csapat[]> {
    return apiRequest<Csapat[]>(user, "/csapatok/", "GET");
}

export async function getCsapat(user: AuthUser, id: number): Promise<Csapat> {
    return apiRequest<Csapat>(user, `/csapatok/${id}`, "GET");
}

export async function createCsapat(
    user: AuthUser, data: Omit<Csapat, "id">
): Promise<MessageResponse> {
    const params = new URLSearchParams(data);
    return apiRequest<MessageResponse>(user, `/csapatok/?${params}`, "PUT");
}

export async function editCsapat(
    user: AuthUser, id: number, data: Partial<Omit<Csapat, "id">>
): Promise<MessageResponse> {
    const params = new URLSearchParams(data);
    return apiRequest(user, `/csapatok/${id}?${params}`, "PATCH");
}

export async function deleteCsapat(
    user: AuthUser, id: number
): Promise<MessageResponse> {
    return apiRequest(user, `/csapatok/${id}`, "DELETE");
}

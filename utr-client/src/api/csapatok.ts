import {AuthUser} from "../types/AuthUser";
import {Csapat} from "../types/model/Csapat";
import {MessageResponse} from "../types/response/MessageResponse";

import {apiRequest} from "../lib/api/http";

export async function getAllCsapatokList(): Promise<Csapat[]> {
    return apiRequest<Csapat[]>("/csapatok/", "GET");
}

export async function getCsapat(id: number): Promise<Csapat> {
    return apiRequest<Csapat>(`/csapatok/${id}`, "GET");
}

export async function createCsapat(
    user: AuthUser, data: Omit<Csapat, "id">
): Promise<MessageResponse> {
    const params = new URLSearchParams(data);
    return apiRequest<MessageResponse>(`/csapatok/?${params}`, "PUT");
}

export async function editCsapat(
    user: AuthUser, id: number, data: Partial<Omit<Csapat, "id">>
): Promise<MessageResponse> {
    const params = new URLSearchParams(data);
    return apiRequest(`/csapatok/${id}?${params}`, "PATCH");
}

export async function deleteCsapat(
    user: AuthUser, id: number
): Promise<MessageResponse> {
    return apiRequest(`/csapatok/${id}`, "DELETE");
}

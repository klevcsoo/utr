import {apiRequest, createAllStringObject} from "../utils/lib/utils";
import {Nevezes, NevezesCreationData} from "./types";
import {AuthUser} from "../auth/types";

export async function getAllNevezesek(user: AuthUser, versenyszamId: number) {
    const params = new URLSearchParams({versenyszamId: String(versenyszamId)});
    return apiRequest<Nevezes[]>(user, `/nevezesek/?${params}`, "GET");
}

export async function getNevezes(user: AuthUser, id: number) {
    return await apiRequest<Nevezes>(user, `/nevezesek/${id}`, "GET");
}

export async function createNevezes(user: AuthUser, data: NevezesCreationData) {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(user, `/nevezesek/?${params}`, "PUT");
}

export async function editNevezes(user: AuthUser, id: number, data: Partial<NevezesCreationData>) {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(user, `/nevezesek/${id}?${params}`, "PATCH");
}

export async function deleteNevezes(user: AuthUser, id: number) {
    return apiRequest(user, `/nevezesek/${id}`, "DELETE");
}
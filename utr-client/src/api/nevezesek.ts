import {createAllStringObject} from "../lib/utils";
import {Nevezes} from "../types/model/Nevezes";
import {NevezesCreationData} from "../types/request/NevezesCreationData";
import {apiRequest} from "../lib/api/http";

export async function getAllNevezesek(versenyszamId: number) {
    const params = new URLSearchParams({versenyszamId: String(versenyszamId)});
    return apiRequest<Nevezes[]>(`/nevezesek/?${params}`, "GET");
}

export async function getNevezes(id: number) {
    return await apiRequest<Nevezes>(`/nevezesek/${id}`, "GET");
}

export async function createNevezes(data: NevezesCreationData) {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(`/nevezesek/?${params}`, "PUT");
}

export async function editNevezes(id: number, data: Partial<NevezesCreationData>) {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(`/nevezesek/${id}?${params}`, "PATCH");
}

export async function deleteNevezes(id: number) {
    return apiRequest(`/nevezesek/${id}`, "DELETE");
}

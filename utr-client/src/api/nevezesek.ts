import {UserDetails} from "../types/UserDetails";
import {apiRequest, createAllStringObject} from "../utils";
import {Nevezes} from "../types/model/Nevezes";
import {NevezesCreationData} from "../types/request/NevezesCreationData";

export async function getAllNevezesek(user: UserDetails, versenyszamId: number) {
    const params = new URLSearchParams({versenyszamId: String(versenyszamId)});
    return apiRequest<Nevezes[]>(user, `/nevezesek/?${params}`, "GET");
}

export async function getNevezes(user: UserDetails, id: number) {
    return await apiRequest<Nevezes>(user, `/nevezesek/${id}`, "GET");
}

export async function createNevezes(user: UserDetails, data: NevezesCreationData) {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(user, `/nevezesek/?${params}`, "PUT");
}

export async function editNevezes(user: UserDetails, id: number, data: Partial<NevezesCreationData>) {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(user, `/nevezesek/${id}?${params}`, "PATCH");
}

export async function deleteNevezes(user: UserDetails, id: number) {
    return apiRequest(user, `/nevezesek/${id}`, "DELETE");
}

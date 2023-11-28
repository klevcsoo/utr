import {createAllStringObject} from "../lib/utils";
import {Versenyszam} from "../types/model/Versenyszam";
import {VersenyszamCreationData} from "../types/request/VersenyszamCreationData";
import {apiRequest} from "../lib/api/http";

export async function getVersenyszamokInVerseny(versenyId: number) {
    const params = new URLSearchParams({versenyId: String(versenyId)});
    return apiRequest<Versenyszam[]>(`/versenyszamok/?${params}`, "GET");
}

export async function getVersenyszam(id: number) {
    return await apiRequest<Versenyszam>(`/versenyszamok/${id}`, "GET");
}

export async function createVersenyszam(data: Omit<VersenyszamCreationData, "id">) {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(`/versenyszamok/?${params}`, "PUT");
}

export async function editVersenyszam(
    id: number, data: Partial<Omit<VersenyszamCreationData, "id">>
) {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(`/versenyszamok/${id}?${params}`, "PATCH");
}

export async function deleteVersenyszam(id: number) {
    return apiRequest(`/uszok/${id}`, "DELETE");
}

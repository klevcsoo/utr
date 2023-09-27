import {AuthUser} from "../types/AuthUser";
import {createAllStringObject} from "../lib/utils";
import {Versenyszam} from "../types/model/Versenyszam";
import {VersenyszamCreationData} from "../types/request/VersenyszamCreationData";
import {apiRequest} from "../lib/api/http";

export async function getVersenyszamokInVerseny(user: AuthUser, versenyId: number) {
    const params = new URLSearchParams({versenyId: String(versenyId)});
    return apiRequest<Versenyszam[]>(user, `/versenyszamok/?${params}`, "GET");
}

export async function getVersenyszam(user: AuthUser, id: number) {
    return await apiRequest<Versenyszam>(user, `/versenyszamok/${id}`, "GET");
}

export async function createVersenyszam(
    user: AuthUser, data: Omit<VersenyszamCreationData, "id">
) {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(user, `/versenyszamok/?${params}`, "PUT");
}

export async function editVersenyszam(
    user: AuthUser, id: number, data: Partial<Omit<VersenyszamCreationData, "id">>
) {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(user, `/versenyszamok/${id}?${params}`, "PATCH");
}

export async function deleteVersenyszam(
    user: AuthUser, id: number
) {
    return apiRequest(user, `/uszok/${id}`, "DELETE");
}

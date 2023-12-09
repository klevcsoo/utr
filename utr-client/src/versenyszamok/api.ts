import {apiRequest, createAllStringObject} from "../utils/lib/utils";
import {Versenyszam, VersenyszamCreationData} from "./types";
import {AuthUser} from "../auth/types";

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
    return apiRequest(user, `/versenyszamok/${id}`, "DELETE");
}
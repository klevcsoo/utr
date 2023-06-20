import {UserDetails} from "../types/UserDetails";
import {apiRequest, createAllStringObject} from "../utils";
import {Versenyszam} from "../types/Versenyszam";
import {VersenyszamCreationData} from "../types/request/VersenyszamCreationData";

export async function getVersenyszamokInVerseny(user: UserDetails, versenyId: number) {
    const params = new URLSearchParams({versenyId: String(versenyId)});
    return apiRequest<Versenyszam[]>(user, `/versenyszamok/?${params}`, "GET");
}

export async function getVersenyszam(user: UserDetails, id: number) {
    return await apiRequest<Versenyszam>(user, `/versenyszamok/${id}`, "GET");
}

export async function createVersenyszam(
    user: UserDetails, data: Omit<VersenyszamCreationData, "id">
) {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(user, `/versenyszamok/?${params}`, "PUT");
}

export async function editVersenyszam(
    user: UserDetails, id: number, data: Partial<Omit<VersenyszamCreationData, "id">>
) {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(user, `/versenyszamok/${id}?${params}`, "PATCH");
}

export async function deleteVersenyszam(
    user: UserDetails, id: number
) {
    return apiRequest(user, `/uszok/${id}`, "DELETE");
}

import {Uszoverseny} from "../types/model/Uszoverseny";
import {apiRequest, createAllStringObject} from "../lib/utils";
import {AuthUser} from "../types/AuthUser";
import {MessageResponse} from "../types/response/MessageResponse";

export async function getAllUszoversenyekList(user: AuthUser): Promise<Uszoverseny[]> {
    const data = await apiRequest<Uszoverseny[]>(user, "/uszoversenyek/", "GET");
    for (const verseny of data) {
        verseny.datum = new Date(verseny.datum);
    }
    return data;
}

export async function getUszoverseny(user: AuthUser, id: number): Promise<Uszoverseny> {
    const data = await apiRequest<Uszoverseny>(user, `/uszoversenyek/${id}`, "GET");
    data.datum = new Date(data.datum);
    return data;
}

export async function createUszoverseny(
    user: AuthUser, data: Omit<Uszoverseny, "id">
): Promise<MessageResponse> {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest<MessageResponse>(user, `/uszoversenyek/?${params}`, "PUT");
}

export async function editUszoverseny(
    user: AuthUser, id: number, data: Partial<Omit<Uszoverseny, "id">>
): Promise<MessageResponse> {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(user, `/uszoversenyek/${id}?${params}`, "PATCH");
}

export async function deleteUszoverseny(
    user: AuthUser, id: number
): Promise<MessageResponse> {
    return apiRequest(user, `/uszoversenyek/${id}`, "DELETE");
}

export async function openUszoverseny(
    user: AuthUser, id: number
): Promise<MessageResponse> {
    return apiRequest(user, `/uszoversenyek/${id}/megnyitas`, "POST");
}

export async function closeUszoverseny(user: AuthUser): Promise<MessageResponse> {
    return apiRequest(user, "/nyitott/lezaras", "POST");
}

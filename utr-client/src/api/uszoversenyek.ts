import {Uszoverseny} from "../types/Uszoverseny";
import {apiRequest, createAllStringObject} from "../utils";
import {UserDetails} from "../types/UserDetails";
import {MessageResponse} from "../types/MessageResponse";

export async function getAllUszoversenyekList(user: UserDetails): Promise<Uszoverseny[]> {
    const data = await apiRequest<Uszoverseny[]>(user, "/uszoversenyek/", "GET");
    for (const verseny of data) {
        verseny.datum = new Date(verseny.datum);
    }
    return data;
}

export async function getUszoverseny(user: UserDetails, id: number): Promise<Uszoverseny> {
    const data = await apiRequest<Uszoverseny>(user, `/uszoversenyek/${id}`, "GET");
    data.datum = new Date(data.datum);
    return data;
}

export async function createUszoverseny(
    user: UserDetails, data: Omit<Uszoverseny, "id">
): Promise<MessageResponse> {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest<MessageResponse>(user, `/uszoversenyek/?${params}`, "PUT");
}

export async function editUszoverseny(
    user: UserDetails, id: number, data: Partial<Omit<Uszoverseny, "id">>
): Promise<MessageResponse> {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(user, `/uszoversenyek/${id}?${params}`, "PATCH");
}

export async function deleteUszoverseny(
    user: UserDetails, id: number
): Promise<MessageResponse> {
    return apiRequest(user, `/uszoversenyek/${id}`, "DELETE");
}

export async function openUszoverseny(
    user: UserDetails, id: number
): Promise<MessageResponse> {
    return apiRequest(user, `/uszoversenyek/${id}/megnyitas`, "POST");
}

export async function closeUszoverseny(user: UserDetails): Promise<MessageResponse> {
    return apiRequest(user, "/nyitott/lezaras", "POST");
}

import {Uszoverseny} from "../types/model/Uszoverseny";
import {createAllStringObject} from "../lib/utils";
import {MessageResponse} from "../types/response/MessageResponse";
import {apiRequest} from "../lib/api/http";

export async function getAllUszoversenyekList(): Promise<Uszoverseny[]> {
    const data = await apiRequest<Uszoverseny[]>("/uszoversenyek/", "GET");
    for (const verseny of data) {
        verseny.datum = new Date(verseny.datum);
    }
    return data;
}

export async function getUszoverseny(id: number): Promise<Uszoverseny> {
    const data = await apiRequest<Uszoverseny>(`/uszoversenyek/${id}`, "GET");
    data.datum = new Date(data.datum);
    return data;
}

export async function createUszoverseny(data: Omit<Uszoverseny, "id">): Promise<MessageResponse> {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest<MessageResponse>(`/uszoversenyek/?${params}`, "PUT");
}

export async function editUszoverseny(
    id: number, data: Partial<Omit<Uszoverseny, "id">>
):
    Promise<MessageResponse> {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(`/uszoversenyek/${id}?${params}`, "PATCH");
}

export async function deleteUszoverseny(id: number): Promise<MessageResponse> {
    return apiRequest(`/uszoversenyek/${id}`, "DELETE");
}

export async function openUszoverseny(id: number): Promise<MessageResponse> {
    return apiRequest(`/uszoversenyek/${id}/megnyitas`, "POST");
}

export async function closeUszoverseny(): Promise<MessageResponse> {
    return apiRequest("/nyitott/lezaras", "POST");
}

import {Uszo} from "../types/model/Uszo";
import {MessageResponse} from "../types/response/MessageResponse";
import {createAllStringObject} from "../lib/utils";
import {apiRequest} from "../lib/api/http";

export async function getAllUszokInCsapat(csapatId: number): Promise<Uszo[]> {
    const params = new URLSearchParams({csapatId: String(csapatId)});
    return apiRequest<Uszo[]>(`/uszok/?${params}`, "GET");
}

export async function getUszo(id: number): Promise<Uszo> {
    return await apiRequest<Uszo>(`/uszok/${id}`, "GET");
}

export async function createUszo(data: Omit<Uszo, "id">): Promise<MessageResponse> {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(`/uszok/?${params}`, "PUT");
}

export async function editUszo(
    id: number, data: Partial<Omit<Uszo, "id">>
): Promise<MessageResponse> {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(`/uszok/${id}?${params}`, "PATCH");
}

export async function deleteUszo(id: number): Promise<MessageResponse> {
    return apiRequest(`/uszok/${id}`, "DELETE");
}

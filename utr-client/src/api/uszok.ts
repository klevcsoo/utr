import {UserDetails} from "../types/UserDetails";
import {Uszo} from "../types/model/Uszo";
import {MessageResponse} from "../types/response/MessageResponse";
import {apiRequest, createAllStringObject} from "../utils";

export async function getAllUszokInCsapat(
    user: UserDetails, csapatId: number
): Promise<Uszo[]> {
    const params = new URLSearchParams({csapatId: String(csapatId)});
    return apiRequest<Uszo[]>(user, `/uszok/?${params}`, "GET");
}

export async function getUszo(user: UserDetails, id: number): Promise<Uszo> {
    return await apiRequest<Uszo>(user, `/uszok/${id}`, "GET");
}

export async function createUszo(
    user: UserDetails, data: Omit<Uszo, "id">
): Promise<MessageResponse> {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(user, `/uszok/?${params}`, "PUT");
}

export async function editUszo(
    user: UserDetails, id: number, data: Partial<Omit<Uszo, "id">>
): Promise<MessageResponse> {
    const params = new URLSearchParams(createAllStringObject(data));
    return apiRequest(user, `/uszok/${id}?${params}`, "PATCH");
}

export async function deleteUszo(
    user: UserDetails, id: number
): Promise<MessageResponse> {
    return apiRequest(user, `/uszok/${id}`, "DELETE");
}

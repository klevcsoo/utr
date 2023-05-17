import {UserDetails} from "../types/UserDetails";
import {Uszo} from "../types/Uszo";
import {MessageResponse} from "../types/MessageResponse";
import {apiRequest, createAllStringObject} from "../utils";

export async function getAllUszokInCsapat(
    user: UserDetails, csapatId: number
): Promise<Uszo[]> {
    const params = new URLSearchParams({csapatId: String(csapatId)});
    return apiRequest(user, `/uszok/?${params}`, "GET");
}

export async function getUszo(user: UserDetails, id: number): Promise<Uszo> {
    return apiRequest(user, `/uszok/${id}`, "GET");
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

import {UserDetails} from "../types/UserDetails";
import {Csapat} from "../types/model/Csapat";
import {MessageResponse} from "../types/response/MessageResponse";
import {apiRequest} from "../utils";

export async function getAllCsapatokList(user: UserDetails): Promise<Csapat[]> {
    return apiRequest<Csapat[]>(user, "/csapatok/", "GET");
}

export async function getCsapat(user: UserDetails, id: number): Promise<Csapat> {
    return apiRequest<Csapat>(user, `/csapatok/${id}`, "GET");
}

export async function createCsapat(
    user: UserDetails, data: Omit<Csapat, "id">
): Promise<MessageResponse> {
    const params = new URLSearchParams(data);
    return apiRequest<MessageResponse>(user, `/csapatok/?${params}`, "PUT");
}

export async function editCsapat(
    user: UserDetails, id: number, data: Partial<Omit<Csapat, "id">>
): Promise<MessageResponse> {
    const params = new URLSearchParams(data);
    return apiRequest(user, `/csapatok/${id}?${params}`, "PATCH");
}

export async function deleteCsapat(
    user: UserDetails, id: number
): Promise<MessageResponse> {
    return apiRequest(user, `/csapatok/${id}`, "DELETE");
}

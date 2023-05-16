import {UserDetails} from "../types/UserDetails";
import {Csapat} from "../types/Csapat";
import {serverURL} from "../config";
import {MessageResponse} from "../types/MessageResponse";

export async function getAllCsapatokList(user: UserDetails): Promise<Csapat[]> {
    return await fetch(
        `${serverURL}/api/csapatok/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${user.jwtToken}`
            }
        }
    ).then(res => res.json()) as Csapat[];
}

export async function getCsapat(user: UserDetails, id: number): Promise<Csapat> {
    return await fetch(
        `${serverURL}/api/csapatok/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${user.jwtToken}`
            }
        }
    ).then(res => res.json()) as Csapat;
}

export async function createCsapat(
    user: UserDetails, data: Omit<Csapat, "id">
): Promise<MessageResponse> {
    const params = new URLSearchParams(data);

    return await fetch(
        `${serverURL}/api/csapatok/?${params}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${user.jwtToken}`
            }
        }
    ).then(res => res.json()) as MessageResponse;
}

export async function editCsapat(
    user: UserDetails, id: number, data: Partial<Omit<Csapat, "id">>
): Promise<MessageResponse> {
    const params = new URLSearchParams(data);

    return await fetch(
        `${serverURL}/api/csapatok/${id}?${params}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${user.jwtToken}`
            }
        }
    ).then(res => res.json()) as MessageResponse;
}

export async function deleteCsapat(
    user: UserDetails, id: number
): Promise<MessageResponse> {
    return await fetch(
        `${serverURL}/api/csapatok/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${user.jwtToken}`
            }
        }
    ).then(res => res.json()) as MessageResponse;
}

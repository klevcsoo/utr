import {UserDetails} from "../types/UserDetails";
import {Uszo} from "../types/Uszo";
import {serverURL} from "../config";

export async function getAllUszokInCsapat(
    user: UserDetails, csapatId: number
): Promise<Uszo[]> {
    const params = new URLSearchParams({csapatId: String(csapatId)});

    return await fetch(
        `${serverURL}/api/uszok/?${params}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${user.jwtToken}`
            }
        }
    ).then(res => res.json()) as Uszo[];
}

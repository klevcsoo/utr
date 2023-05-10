import {serverURL} from "../config";
import {Uszoverseny} from "../types/Uszoverseny";
import {Versenyszam} from "../types/Versenyszam";
import {UserDetails} from "../types/UserDetails";

export async function getOpenUszoverseny(user: UserDetails): Promise<Uszoverseny> {
    const data: Uszoverseny = await fetch(
        `${serverURL}/api/nyitott/reszletek`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${user.jwtToken}`
            }
        }).then(res => res.json()
    );

    data.datum = new Date(data.datum);
    return data;
}

export async function getOpenVersenyszamok(user: UserDetails): Promise<Versenyszam[]> {
    return await fetch(
        `${serverURL}/api/nyitott/versenyszamok`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${user.jwtToken}`
            }
        }).then(res => res.json()
    ) as Versenyszam[];
}

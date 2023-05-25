import {Uszoverseny} from "../types/Uszoverseny";
import {Versenyszam} from "../types/Versenyszam";
import {UserDetails} from "../types/UserDetails";
import {apiRequest} from "../utils";

export async function getOpenUszoverseny(user: UserDetails): Promise<Uszoverseny> {
    const data = await apiRequest<Uszoverseny>(user, "/nyitott/reszletek", "GET");
    data.datum = new Date(data.datum);
    return data;
}

export async function getOpenVersenyszamok(user: UserDetails): Promise<Versenyszam[]> {
    return apiRequest(user, "/nyitott/versenyszamok", "GET");
}

import {Uszoverseny} from "../types/model/Uszoverseny";
import {Versenyszam} from "../types/model/Versenyszam";
import {AuthUser} from "../types/AuthUser";
import {apiRequest} from "../utils";

export async function getOpenUszoverseny(user: AuthUser): Promise<Uszoverseny> {
    const data = await apiRequest<Uszoverseny>(user, "/nyitott/reszletek", "GET");
    data.datum = new Date(data.datum);
    return data;
}

export async function getOpenVersenyszamok(user: AuthUser): Promise<Versenyszam[]> {
    return apiRequest(user, "/nyitott/versenyszamok", "GET");
}

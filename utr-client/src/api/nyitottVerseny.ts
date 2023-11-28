import {Uszoverseny} from "../types/model/Uszoverseny";
import {Versenyszam} from "../types/model/Versenyszam";

import {apiRequest} from "../lib/api/http";

export async function getOpenUszoverseny(): Promise<Uszoverseny> {
    const data = await apiRequest<Uszoverseny>("/nyitott/reszletek", "GET");
    data.datum = new Date(data.datum);
    return data;
}

export async function getOpenVersenyszamok(): Promise<Versenyszam[]> {
    return apiRequest("/nyitott/versenyszamok", "GET");
}

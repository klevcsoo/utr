import {MessageResponse} from "../../types/response/MessageResponse";
import {AuthUser} from "../../types/AuthUser";
import {artificialAPIDelay, serverURL} from "../config";
import {sleep} from "../utils";

export async function apiRequest<T extends object = MessageResponse>(
    _user: AuthUser | null,
    path: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
): Promise<T> {
    const actualPath = path.startsWith("/") ? path.substring(1) : path;
    const lang = window.localStorage.getItem("locale");

    if (window.location.origin.includes("localhost") && artificialAPIDelay) {
        await sleep(Math.random() * 1200);
    }

    const data = await fetch(`${serverURL}/api/v2/${actualPath}`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Accept-Language": lang ?? "hu"
        },
        credentials: "include"
    }).then(res => res.json()) as T;

    const error = (data as any)["error"];
    if (error) {
        throw new Error(error);
    }

    return data;
}

import {AuthUser} from "./types/AuthUser";
import {artificialAPIDelay, serverURL} from "./config";
import {MessageResponse} from "./types/response/MessageResponse";

export function createAllStringObject<T extends object>(
    obj: T
): { [key in keyof T]: string } {
    const out: { [key in keyof T]: string } = {} as any;
    for (const key of Object.keys(obj) as (keyof T)[]) {
        if (!obj[key]) {
            continue;
        }

        if (obj[key] instanceof Date) {
            out[key] = (obj[key] as Date).toISOString();
        } else {
            out[key] = String(obj[key]);
        }
    }
    return out;
}

export async function apiRequest<T extends object = MessageResponse>(
    user: AuthUser,
    path: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
): Promise<T> {
    const actualPath = path.startsWith("/") ? path.substring(1) : path;
    const lang = window.localStorage.getItem("locale");

    if (window.location.origin.includes("localhost") && artificialAPIDelay) {
        await sleep(Math.random() * 1200);
    }

    const data = await fetch(`${serverURL}/api/${actualPath}`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.jwtToken}`,
            "Accept-Language": lang ?? "hu"
        }
    }).then(res => res.json()) as T;

    const error = (data as any)["error"];
    if (error) {
        throw new Error(error);
    }

    return data;
}

export async function sleep(milliseconds: number) {
    return new Promise<void>(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

export function formatInterval(milliseconds: number): string {
    const seconds = milliseconds / 1000;
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = (seconds % 60).toFixed(3);

    return `${minutes}:${remainderSeconds}`;
}

export function hungarianNormalize(input: string): string {
    const normalizationMap: { [key: string]: string } = {
        "á": "a",
        "é": "e",
        "í": "i",
        "óöő": "o",
        "úüű": "u"
    };

    let output = "";
    for (let i = 0; i < input.length; i++) {
        let charDone = false;
        for (const key of Object.keys(normalizationMap)) {
            if (key.includes(input[i])) {
                output += normalizationMap[key];
                charDone = true;
                break;
            }
        }

        if (!charDone) {
            output += input[i];
        }
    }

    return output;
}

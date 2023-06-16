import {UserDetails} from "./types/UserDetails";
import {serverURL} from "./config";

export function createAllStringObject<T extends object>(
    obj: T
): { [key in keyof T]: string } {
    const out: { [key in keyof T]: string } = {} as any;
    for (const key of Object.keys(obj) as (keyof T)[]) {
        out[key] = String(obj[key]);
    }
    return out;
}

export async function apiRequest<T extends object>(
    user: UserDetails,
    path: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
): Promise<T> {
    const actualPath = path.startsWith("/") ? path.substring(1) : path;

    if (window.location.origin.includes("localhost")) {
        await sleep(Math.random() * 1200);
    }

    return await fetch(`${serverURL}/api/${actualPath}`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.jwtToken}`
        }
    }).then(res => res.json()) as T;
}

export async function sleep(milliseconds: number) {
    return new Promise<void>(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

export function customDateFormat(date: Date): string {
    return date.toISOString().split("T")[0].replaceAll("-", ". ") + ".";
}

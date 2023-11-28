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

export function typedObjectKeys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
}


export function isBetweenInclusive(n: number, min: number, max: number): boolean {
    return n >= min && n <= max;
}

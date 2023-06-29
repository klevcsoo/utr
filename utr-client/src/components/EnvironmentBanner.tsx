import {useMemo} from "react";
import {packageVersion} from "../config";

export function EnvironmentBanner() {
    const devEnv = useMemo<boolean>(() => {
        return window.location.hostname === "localhost";
    }, []);

    const preRelease = useMemo(() => {
        return !!(packageVersion?.endsWith("alpha") ||
            packageVersion?.endsWith("beta") ||
            packageVersion?.endsWith("RC"));
    }, []);

    return !devEnv && !preRelease ? null : (
        <div
            className={`fixed inset-0 h-6 ${devEnv ? "bg-red-500" : "bg-amber-500"}\
            flex flex-row gap-2 justify-center items-center\
            ${devEnv ? "text-white" : "text-black"} text-sm`}>
            {devEnv ? <p className="text-inherit">
                Fejlesztői környezet
            </p> : null}
            {preRelease ? <p className="text-inherit">
                Pre-Release
            </p> : null}
            <p className="text-inherit">
                Verzió: {packageVersion ?? "ismeretlen"}
            </p>
        </div>
    );
}

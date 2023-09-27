import {useTranslation} from "../hooks/translations";
import {useMemo} from "react";
import {packageVersion} from "../lib/config";

export function EnvironmentBanner() {
    const t = useTranslation();

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
            className={`rounded-b-xl h-8
            ${devEnv ? "bg-red-500" : "bg-amber-500"}\
            flex flex-row gap-2 justify-center items-center\
            ${devEnv ? "text-white" : "text-black"} text-sm`}>
            {devEnv ? <p className="text-inherit">
                {t("generic_label.developer.developer_environment")}
            </p> : null}
            {preRelease ? <p className="text-inherit">
                {t("generic_label.developer.pre_release")}
            </p> : null}
            <p className="text-inherit">
                {packageVersion ?? t("generic_label.unknown")}
            </p>
        </div>
    );
}

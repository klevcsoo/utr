import {useSetAdminLayoutTitle} from "../hooks/useSetAdminLayoutTitle";
import {TabSelector} from "../components/inputs/TabSelector";
import {useSearchParams} from "react-router-dom";
import {useServerEnvVars} from "../hooks/support/useServerEnvVars";
import {LoadingSpinner} from "../components/LoadingSpinner";
import {DataTable} from "../components/tables/DataTable";
import {useEffect, useMemo} from "react";
import {useServerLog} from "../hooks/support/useServerLog";
import {PrimaryButton} from "../components/inputs/buttons/PrimaryButton";
import {BorderCard} from "../components/containers/BorderCard";
import {useTranslation} from "../hooks/translations/useTranslation";

const ENV_TAB_KEY = "env";
const LOG_TAB_KEY = "log";

export function SupportPage() {
    const t = useTranslation();
    const [searchParams] = useSearchParams();

    useSetAdminLayoutTitle(t("title.admin_layout.support")!);

    return (
        <div className="flex flex-col gap-8 items-center w-full">
            <TabSelector tabs={[
                {name: t("support.environment_variables")!, key: ENV_TAB_KEY},
                {name: t("support.log")!, key: LOG_TAB_KEY}
            ]} defaultTabKey="env"/>
            {!searchParams.has("tab") || searchParams.get("tab") === ENV_TAB_KEY ? (
                <EnvironmentVariables/>
            ) : (
                <ServerLog/>
            )}
        </div>
    );
}

function EnvironmentVariables() {
    const t = useTranslation();
    const [variables, loadingVariables] = useServerEnvVars();

    const utrVariables = useMemo(() => {
        return variables.filter(value => value.key.startsWith("UTR_"));
    }, [variables]);

    const nonUtrVariables = useMemo(() => {
        return variables.filter(value => !value.key.startsWith("UTR_"));
    }, [variables]);

    return loadingVariables ? (
        <LoadingSpinner/>
    ) : (
        <div className="flex flex-col gap-2">
            <h3>{t("support.utr_variables")}</h3>
            <DataTable dataList={utrVariables} excludedProperties={["id"]}/>
            <div className="h-2"></div>
            <h3>{t("support.other_variables")}</h3>
            <DataTable dataList={nonUtrVariables} excludedProperties={["id"]}/>
        </div>
    );
}

function ServerLog() {
    const t = useTranslation();
    const [serverLog, loadingServerLog, refreshServerLog] = useServerLog();

    useEffect(() => {
        window.scrollTo({left: 0, top: document.body.scrollHeight, behavior: "smooth"});
    }, []);

    return (
        <div className="flex flex-col gap-8 items-center">
            <BorderCard className="flex flex-col">
                {serverLog.map((value, index) => (
                    <code key={index}>{value}</code>
                ))}
            </BorderCard>
            <PrimaryButton text={t("actions.generic.refresh")!}
                           onClick={refreshServerLog} disabled={loadingServerLog}/>
        </div>
    );
}

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

const ENV_TAB_KEY = "env";
const LOG_TAB_KEY = "log";

export function SupportPage() {
    const [searchParams] = useSearchParams();

    useSetAdminLayoutTitle("Támogatás");

    return (
        <div className="flex flex-col gap-8 items-center w-full">
            <TabSelector tabs={[
                {name: "Környezeti változók", key: ENV_TAB_KEY},
                {name: "Szerver log", key: LOG_TAB_KEY}
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
            <h3>UTR változók</h3>
            <DataTable dataList={utrVariables} excludedProperties={["id"]}/>
            <div className="h-2"></div>
            <h3>Egyéb változók:</h3>
            <DataTable dataList={nonUtrVariables} excludedProperties={["id"]}/>
        </div>
    );
}

function ServerLog() {
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
            <PrimaryButton text="Refresh" onClick={refreshServerLog}
                           disabled={loadingServerLog}/>
        </div>
    );
}

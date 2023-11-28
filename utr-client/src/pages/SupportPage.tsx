import {useEffect, useMemo} from "react";
import {useTranslation} from "../hooks/translations/useTranslation";
import {
    Button,
    Card,
    CardBody,
    Spinner,
    Tab,
    TabPanel,
    Tabs,
    TabsBody,
    TabsHeader,
    Typography
} from "@material-tailwind/react";
import {DataTable, DataTableDataColumn} from "../components/tables";
import {KeyValueObject} from "../types/KeyValueObject";
import {Identifiable} from "../types/Identifiable";
import {useServerEnvVars, useServerLog} from "../support/hooks";

const ENV_TAB_KEY = "env";
const LOG_TAB_KEY = "log";

export function SupportPage() {
    const t = useTranslation();

    return (
        <Card>
            <CardBody>
                <Tabs value={ENV_TAB_KEY}>
                    <TabsHeader>
                        <Tab value={ENV_TAB_KEY}>
                            {t("support.environment_variables")}
                        </Tab>
                        <Tab value={LOG_TAB_KEY}>
                            {t("support.log")}
                        </Tab>
                    </TabsHeader>
                    <TabsBody>
                        <TabPanel value={ENV_TAB_KEY}>
                            <EnvironmentVariables/>
                        </TabPanel>
                        <TabPanel value={LOG_TAB_KEY}>
                            <ServerLog/>
                        </TabPanel>
                    </TabsBody>
                </Tabs>
            </CardBody>
        </Card>
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
        <Spinner/>
    ) : (
        <div className="flex flex-col gap-2 overflow-x-scroll">
            <Typography>{t("support.utr_variables")}</Typography>
            {!!utrVariables.length ? <VariablesTable variables={utrVariables}/> : null}
            <div className="h-2"></div>
            <Typography>{t("support.other_variables")}</Typography>
            {!!nonUtrVariables.length ? <VariablesTable variables={nonUtrVariables}/> : null}
        </div>
    );
}

function VariablesTable(props: { variables: Identifiable<KeyValueObject<string, string>>[] }) {
    return (
        <DataTable dataList={props.variables} excludedProperties={["id"]}>
            <DataTableDataColumn list={props.variables} forKey="key"
                                 element={value => (
                                     <Typography variant="small">{value}</Typography>
                                 )}/>
            <DataTableDataColumn list={props.variables} forKey="value"
                                 element={value => (
                                     <Typography variant="small" className="break-all">
                                         {value}
                                     </Typography>
                                 )}/>
        </DataTable>
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
            <div className="flex flex-col">
                {serverLog.map((value, index) => (
                    <Typography as="code" key={index}
                                className="font-mono break-all border-b border-b-blue-gray-50">
                        {value}
                    </Typography>
                ))}
            </div>
            <Button color="blue" onClick={refreshServerLog} disabled={loadingServerLog}>
                {t("actions.generic.refresh")}
            </Button>
        </div>
    );
}

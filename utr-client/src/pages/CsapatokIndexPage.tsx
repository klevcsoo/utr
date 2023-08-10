import {useCsapatokList} from "../hooks/csapatok/useCsapatokList";
import {Link, useSearchParams} from "react-router-dom";
import {Fragment, useCallback, useMemo, useState} from "react";
import {TextInput} from "../components/inputs/TextInput";
import {useAuthUser} from "../hooks/auth/useAuthUser";
import {createCsapat} from "../api/csapatok";
import {useSetAdminLayoutTitle} from "../hooks/useSetAdminLayoutTitle";
import {useTranslation} from "../hooks/translations/useTranslation";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Dialog,
    Spinner,
    Typography
} from "@material-tailwind/react";
import {DataTable, DataTableDataColumn} from "../components/tables";
import {DataTableActionColumn} from "../components/tables/DataTableActionColumn";
import {PlusIcon} from "@heroicons/react/24/solid";

const MODAL_PARAM_KEY = "modal";
const NEW_CSAPAT_PARAM_VALUE = "newCsapat";

export function CsapatokIndexPage() {
    const [csapatok, csapatokLoading] = useCsapatokList();
    const [, setSearchParams] = useSearchParams();
    const t = useTranslation();

    useSetAdminLayoutTitle(t("title.admin_layout.csapatok"));

    return csapatokLoading ? (
        <div className="w-full h-full grid place-content-center">
            <Spinner/>
        </div>
    ) : (
        <Fragment>
            <Card className="w-full mt-6">
                <CardHeader variant="gradient" color="blue-gray"
                            className="p-4 mb-4 text-center">
                    <Typography variant="h5">
                        {t("title.admin_layout.csapatok")}
                    </Typography>
                </CardHeader>
                <CardBody>
                    <DataTable dataList={csapatok} excludedProperties={["id"]}>
                        <DataTableDataColumn list={csapatok} forKey="nev"
                                             header={t("generic_label.name")}
                                             element={value => (
                                                 <Typography variant="small">{value}</Typography>
                                             )}/>
                        <DataTableDataColumn list={csapatok} forKey="varos"
                                             header={t("generic_label.city")}
                                             element={value => (
                                                 <Typography variant="small">{value}</Typography>
                                             )}/>
                        <DataTableActionColumn list={csapatok} element={entry => (
                            <Link to={String(entry.id)}>
                                <Button variant="text" color="blue-gray">
                                    {t("actions.generic.edit")}
                                </Button>
                            </Link>
                        )}/>
                    </DataTable>
                </CardBody>
                <CardFooter>
                    <Button color="blue" variant="outlined" onClick={() => {
                        setSearchParams({[MODAL_PARAM_KEY]: NEW_CSAPAT_PARAM_VALUE});
                    }}>
                        {t("actions.csapat.create")}
                    </Button>
                </CardFooter>
            </Card>
            <NewCsapatDialog/>
        </Fragment>
    );
}

function NewCsapatDialog() {
    const user = useAuthUser();
    const [searchParams, setSearchParams] = useSearchParams();
    const t = useTranslation();

    const [nev, setNev] = useState("");
    const [varos, setVaros] = useState("");

    const open = useMemo(() => {
        return searchParams.has(MODAL_PARAM_KEY) &&
            searchParams.get(MODAL_PARAM_KEY) === NEW_CSAPAT_PARAM_VALUE;
    }, [searchParams]);

    const setOpen = useCallback((open: boolean) => {
        setSearchParams(state => {
            if (open) state.set(MODAL_PARAM_KEY, NEW_CSAPAT_PARAM_VALUE);
            else state.delete(MODAL_PARAM_KEY);

            return state;
        });
    }, [setSearchParams]);

    const canComplete = useMemo<boolean>(() => {
        return !!nev && !!varos;
    }, [nev, varos]);

    const doComplete = useCallback(() => {
        if (!!user && !!nev && !!varos) {
            createCsapat(user, {nev: nev, varos: varos}).then(({message}) => {
                console.log(message);
                setSearchParams(prevState => {
                    prevState.delete("modal");
                    return prevState;
                });
            }).catch(console.error);
        }
    }, [user, nev, varos, setSearchParams]);

    return (
        <Dialog open={open} handler={setOpen}>
            <Card>
                <CardHeader variant="gradient" color="blue-gray"
                            className="p-4 mb-4 text-center
                            flex flex-row items-center justify-center gap-2">
                    <PlusIcon className="w-8"/>
                    <Typography variant="h5">
                        {t("actions.csapat.create")}
                    </Typography>
                </CardHeader>
                <CardBody className="flex flex-col gap-2">
                    <TextInput value={nev} onValue={setNev}
                               label={t("generic_label.name")}/>
                    <TextInput value={varos} onValue={setVaros}
                               label={t("generic_label.city")}/>
                </CardBody>
                <CardFooter className="flex flex-row gap-2">
                    <Button color="blue" variant="outlined" fullWidth
                            onClick={() => setOpen(false)}>
                        {t("generic_label.rather_not")}
                    </Button>
                    <Button color="blue" variant="filled" fullWidth onClick={doComplete}
                            disabled={!canComplete}>
                        {t("generic_label.lets_go")}
                    </Button>
                </CardFooter>
            </Card>
        </Dialog>
    );
}

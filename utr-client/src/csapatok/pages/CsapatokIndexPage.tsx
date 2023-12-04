import {Link, useSearchParams} from "react-router-dom";
import {Fragment, useCallback, useMemo, useState} from "react";
import {TextInput} from "../../utils/components/inputs/TextInput";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Dialog,
    Typography
} from "@material-tailwind/react";
import {DataTable, DataTableDataColumn} from "../../utils/components/data-table";
import {DataTableActionColumn} from "../../utils/components/data-table/DataTableActionColumn";
import {PlusIcon} from "@heroicons/react/24/solid";
import {useTranslation} from "../../translations/hooks";
import {useSetAdminLayoutTitle} from "../../utils/hooks";
import {useOrganisationFromContext} from "../../organisation/hooks";
import {useCreateCsapat} from "../hooks";

const MODAL_PARAM_KEY = "modal";
const NEW_CSAPAT_PARAM_VALUE = "newCsapat";

export function CsapatokIndexPage() {
    const {csapatok} = useOrganisationFromContext();
    const [, setSearchParams] = useSearchParams();
    const t = useTranslation();

    useSetAdminLayoutTitle(t("title.admin_layout.csapatok"));

    return (
        <Fragment>
            <Card>
                <CardHeader>
                    <Typography variant="h5">
                        {t("title.admin_layout.csapatok")}
                    </Typography>
                </CardHeader>
                <CardBody>
                    <DataTable dataList={csapatok} excludedProperties={["id"]}>
                        <DataTableDataColumn list={csapatok} forKey="nev"
                                             header={t("generic_label.name")}
                                             element={value => (
                                                 <Typography variant="small" className="font-bold">
                                                     {value}
                                                 </Typography>
                                             )}/>
                        <DataTableDataColumn list={csapatok} forKey="varos"
                                             header={t("generic_label.city")}
                                             element={value => (
                                                 <Typography variant="small">{value}</Typography>
                                             )}/>
                        <DataTableActionColumn list={csapatok} element={entry => (
                            <Link to={String(entry.id)}>
                                <Button variant="text" color="gray">
                                    {t("actions.generic.edit")}
                                </Button>
                            </Link>
                        )}/>
                    </DataTable>
                </CardBody>
                <CardFooter>
                    <Button variant="text" onClick={() => {
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
    const t = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const createCsapat = useCreateCsapat();

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
        if (!!nev && !!varos) {
            createCsapat({nev: nev, varos: varos}).then(value => {
                console.log(value);
                setSearchParams(prevState => {
                    prevState.delete("modal");
                    return prevState;
                });
            }).catch(console.error);
        }
    }, [nev, varos, createCsapat, setSearchParams]);

    return (
        <Dialog open={open} handler={setOpen}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-center gap-2">
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
                    <Button variant="text" fullWidth
                            onClick={() => setOpen(false)}>
                        {t("generic_label.rather_not")}
                    </Button>
                    <Button variant="filled" fullWidth onClick={doComplete}
                            disabled={!canComplete}>
                        {t("generic_label.lets_go")}
                    </Button>
                </CardFooter>
            </Card>
        </Dialog>
    );
}

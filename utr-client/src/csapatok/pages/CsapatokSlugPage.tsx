import {useSearchParams} from "react-router-dom";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {TextInput} from "../../utils/components/inputs/TextInput";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Dialog,
    Input,
    Typography
} from "@material-tailwind/react";
import {DataTable, DataTableDataColumn} from "../../utils/components/data-table";
import {DataTableActionColumn} from "../../utils/components/data-table/DataTableActionColumn";
import {PlusIcon} from "@heroicons/react/24/solid";
import {useCsapatFromContext, useDeleteCsapat, useEditCsapat} from "../hooks";
import {useTranslation} from "../../translations/hooks";
import {useCreateUszo, useDeleteUszo, useUszoDetails} from "../../uszok/hooks";
import {useGetEmberiNemElnevezes} from "../../utils/hooks";
import {NumberInput} from "../../utils/components/inputs/NumberInput";
import {EmberiNemSelect} from "../../uszok/components/EmberiNemSelect";
import {EmberiNemId} from "../../uszok/types";

const MODAL_PARAM_KEY = "modal";
const USZO_ID_PARAM_KEY = "uszoId";
const USZO_PARAM_VALUE = "uszo";

export function CsapatokSlugPage() {
    return (
        <Fragment>
            <div className="w-full flex flex-col gap-4 items-start">
                <CsapatDetailsForm/>
                <UszokList/>
            </div>
            <UszoModal/>
        </Fragment>
    );
}

function CsapatDetailsForm() {
    const t = useTranslation();

    const {csapat} = useCsapatFromContext();

    const deleteCsapat = useDeleteCsapat();
    const editCsapat = useEditCsapat();

    const [isDirty, setIsDirty] = useState(false);
    const [nev, setNev] = useState(csapat.nev);
    const [varos, setVaros] = useState(csapat.varos);

    const doCommitChanges = useCallback(() => {
        editCsapat(csapat.id, {
            nev: nev,
            varos: varos
        }).then(message => {
            console.log(message);
            setIsDirty(false);
        }).catch(console.error);
    }, [editCsapat, nev, csapat, varos]);

    const doDelete = useCallback(() => {
        if (!!csapat) {
            deleteCsapat(csapat.id).then(console.log);
        }
    }, [csapat, deleteCsapat]);

    useEffect(() => {
        setIsDirty(csapat.nev !== nev || csapat.varos !== varos);
    }, [nev, csapat, varos]);

    return (
        <Card>
            <CardHeader>
                <Typography variant="h5">
                    {csapat.nev}
                </Typography>
            </CardHeader>
            <CardBody className="grid grid-cols-2 gap-2">
                <Input label={t("csapat.name")} value={nev} onChange={event => {
                    setNev(event.currentTarget.value);
                }}/>
                <Input label={t("csapat.city")} value={varos} onChange={event => {
                    setVaros(event.currentTarget.value);
                }}/>
            </CardBody>
            <CardFooter className="flex flex-row gap-2">
                <Button disabled={!isDirty} onClick={doCommitChanges}>
                    {t("actions.generic.save_changes")}
                </Button>
                <Button onClick={doDelete} variant="text" color="red">
                    {t("actions.csapat.delete")}
                </Button>
            </CardFooter>
        </Card>
    );
}

function UszokList() {
    const t = useTranslation();
    const getEmberiNemElnevezes = useGetEmberiNemElnevezes();

    const {uszok} = useCsapatFromContext();

    const deleteUszo = useDeleteUszo();
    const [, setSearchParams] = useSearchParams();

    const displayedUszok = useMemo(() => {
        if (!uszok) {
            return [];
        }

        return uszok.map(value => {
            return {...value, nem: getEmberiNemElnevezes(value.nem)};
        });
    }, [getEmberiNemElnevezes, uszok]);

    const doOpenEditUszoModal = useCallback((id: number) => {
        setSearchParams(prevState => {
            prevState.set(MODAL_PARAM_KEY, USZO_PARAM_VALUE);
            prevState.set(USZO_ID_PARAM_KEY, String(id));
            return prevState;
        });
    }, [setSearchParams]);

    const doOpenNewUszoModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.set(MODAL_PARAM_KEY, USZO_PARAM_VALUE);
            return prevState;
        });
    }, [setSearchParams]);

    const doDeleteUszo = useCallback((id: number) => {
        if (window.confirm(t("confirm.generic.delete"))) {
            deleteUszo(id).then(console.log).catch(console.error);
        }
    }, [deleteUszo, t]);

    return (
        <Card>
            {!uszok || !uszok.length ? (
                <CardBody className="grid place-content-center">
                    <Typography>{t("csapat.no_uszok")}</Typography>
                </CardBody>
            ) : (
                <CardBody>
                    <DataTable dataList={displayedUszok} excludedProperties={["id"]}>
                        <DataTableDataColumn list={displayedUszok} forKey="nev"
                                             header={t("generic_label.name")}
                                             element={value => (
                                                 <Typography
                                                     variant="small">{value}</Typography>
                                             )}/>
                        <DataTableDataColumn list={displayedUszok} forKey="szuletesiEv"
                                             header={t("generic_label.year_of_birth")}
                                             element={value => (
                                                 <Typography
                                                     variant="small">{value}</Typography>
                                             )}/>
                        <DataTableActionColumn list={displayedUszok} element={entry => (
                            <Fragment>
                                <Button variant="text" color="gray" onClick={() => {
                                    doOpenEditUszoModal(entry.id);
                                }}>
                                    {t("actions.generic.edit")}
                                </Button>
                                <Button variant="text" color="red" onClick={() => {
                                    doDeleteUszo(entry.id);
                                }}>
                                    {t("actions.generic.delete")}
                                </Button>
                            </Fragment>
                        )}/>
                    </DataTable>
                </CardBody>
            )}
            <CardFooter>
                <Button variant="text" onClick={doOpenNewUszoModal}>
                    {t("actions.uszo.create")}
                </Button>
            </CardFooter>
        </Card>
    );
}

function UszoModal() {
    const t = useTranslation();

    const {csapat} = useCsapatFromContext();

    const [searchParams, setSearchParams] = useSearchParams();
    const [uszo] = useUszoDetails(
        searchParams.has(USZO_ID_PARAM_KEY) ?
            parseInt(searchParams.get(USZO_ID_PARAM_KEY)!) : undefined
    );
    const createUszo = useCreateUszo();

    const [nev, setNev] = useState("");
    const [szuletesiEv, setSzuletesiEv] = useState((new Date()).getFullYear());
    const [nem, setNem] = useState<EmberiNemId>("NEM_NO");

    const open = useMemo(() => {
        return searchParams.has(MODAL_PARAM_KEY) &&
            searchParams.get(MODAL_PARAM_KEY) === USZO_PARAM_VALUE;
    }, [searchParams]);

    const setOpen = useCallback((open: boolean) => {
        setSearchParams(state => {
            if (open) state.set(MODAL_PARAM_KEY, USZO_PARAM_VALUE);
            else state.delete(MODAL_PARAM_KEY);

            return state;
        });

        if (!open) {
            setNev("");
            setSzuletesiEv(0);
            setNem("NEM_NO");
        }
    }, [setSearchParams]);

    const canComplete = useMemo(() => {
        return !!nev && !!szuletesiEv && !!nem;
    }, [nem, nev, szuletesiEv]);

    const modalTitle = useMemo(() => {
        return searchParams.has(USZO_ID_PARAM_KEY) ?
            t("actions.uszo.edit") :
            t("actions.uszo.create");
    }, [searchParams, t]);

    const doComplete = useCallback(() => {
        if (!!csapat && !!nev && !!szuletesiEv && !!nem) {
            createUszo({
                nev: nev,
                szuletesiEv: szuletesiEv,
                nem: nem,
                csapatId: csapat.id
            }).then(message => {
                console.log(message);
                setOpen(false);
            }).catch(console.error);
        }
    }, [createUszo, setOpen, nem, nev, csapat, szuletesiEv]);

    useEffect(() => {
        if (!!uszo) {
            setNev(uszo.nev);
            setSzuletesiEv(uszo.szuletesiEv);
            setNem(uszo.nem as EmberiNemId);
        }
    }, [uszo]);

    return (
        <Dialog open={open} handler={setOpen}>
            <Card>

                <CardHeader className="flex flex-row items-center justify-center gap-4">
                    <PlusIcon className="w-8"/>
                    <Typography variant="h5">
                        {modalTitle}
                    </Typography>
                </CardHeader>
                <CardBody className="flex flex-col items-center gap-2">
                    <TextInput value={nev} onValue={setNev}
                               label={t("uszo.name")}/>
                    <div className="flex flex-row gap-2 w-full">
                        <NumberInput value={szuletesiEv} onValue={setSzuletesiEv}
                                     min={1980} max={(new Date()).getFullYear()}
                                     label={t("uszo.year_of_birth")}
                                     className="row-start-2"/>
                        <EmberiNemSelect selected={nem} onSelect={setNem}/>
                    </div>
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

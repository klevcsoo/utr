import {Link, useParams, useSearchParams} from "react-router-dom";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {TextInput} from "../components/inputs/TextInput";
import {EmberiNemId} from "../types/EmberiNemId";
import {NumberInput} from "../components/inputs";
import {Csapat} from "../types/model/Csapat";
import {useTranslation} from "../hooks/translations";
import {EmberiNemSelect} from "../components/selects";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Dialog,
    Input,
    Spinner,
    Typography
} from "@material-tailwind/react";
import {DestructiveButton} from "../components/buttons";
import {DataTable, DataTableDataColumn} from "../components/tables";
import {DataTableActionColumn} from "../components/tables/DataTableActionColumn";
import {PlusIcon} from "@heroicons/react/24/solid";
import {deleteCsapat, editCsapat} from "../api/csapatok";
import {createUszo, deleteUszo} from "../api/uszok";
import {useCsapatDetails} from "../hooks/csapatok";
import {useGetEmberiNemElnevezes, useSetAdminLayoutTitle} from "../hooks";
import {useUszoDetails, useUszokList} from "../hooks/uszok";

const MODAL_PARAM_KEY = "modal";
const USZO_ID_PARAM_KEY = "uszoId";
const USZO_PARAM_VALUE = "uszo";

export function CsapatokSlugPage() {
    const t = useTranslation();

    const {id} = useParams();
    const idNumber = useMemo(() => parseInt(id ?? "-1"), [id]);

    const [csapat, csapatLoading] = useCsapatDetails(idNumber);

    useSetAdminLayoutTitle(!csapat ? t("generic_label.loading") : csapat.nev);

    return csapatLoading ? (
        <div className="w-full h-full grid place-content-center">
            <Spinner/>
        </div>
    ) : !csapat ? (
        <div className="h-full grid place-content-center">
            <div className="flex flex-col gap-2 items-center">
                <p>{t("csapat.not_found")}</p>
                <Link to=".." relative="path">
                    <Button color="blue" variant="filled">{t("actions.generic.back")}</Button>
                </Link>
            </div>
        </div>
    ) : (
        <Fragment>
            <div className="w-full flex flex-col gap-4 items-start">
                <CsapatDetailsForm csapat={csapat}/>
                <UszokList csapat={csapat}/>
            </div>
            <UszoModal csapat={csapat}/>
        </Fragment>
    );
}

function CsapatDetailsForm(props: {
    csapat: Csapat
}) {
    const t = useTranslation();

    const [isDirty, setIsDirty] = useState(false);
    const [nev, setNev] = useState(props.csapat.nev);
    const [varos, setVaros] = useState(props.csapat.varos);

    const doCommitChanges = useCallback(() => {
        editCsapat(props.csapat.id, {
            nev: nev,
            varos: varos
        }).then(message => {
            console.log(message);
            setIsDirty(false);
        }).catch(console.error);
    }, [nev, props.csapat, varos]);

    const doDelete = useCallback(() => {
        if (!!props.csapat) {
            deleteCsapat(props.csapat.id).then(console.log);
        }
    }, [props.csapat]);

    useEffect(() => {
        setIsDirty(props.csapat.nev !== nev || props.csapat.varos !== varos);
    }, [nev, props.csapat, varos]);

    return (
        <Card className="w-full mt-6">
            <CardHeader variant="gradient" color="blue-gray" className="p-4 mb-4 text-center">
                <Typography variant="h5">
                    {props.csapat.nev}
                </Typography>
            </CardHeader>
            <CardBody>
                <form className="flex flex-col gap-4">
                    <Input label={t("csapat.name")} value={nev} onChange={event => {
                        setNev(event.currentTarget.value);
                    }}/>
                    <Input label={t("csapat.city")} value={varos} onChange={event => {
                        setVaros(event.currentTarget.value);
                    }}/>
                </form>
            </CardBody>
            <CardFooter className="flex flex-row gap-2">
                <Button color="blue" disabled={!isDirty} onClick={doCommitChanges}>
                    {t("actions.generic.save_changes")}
                </Button>
                <DestructiveButton confirmText={t("confirm.generic.delete")}
                                   onConfirm={doDelete}>
                    {t("actions.csapat.delete")}
                </DestructiveButton>
            </CardFooter>
        </Card>
    );
}

function UszokList(props: {
    csapat: Csapat
}) {
    const t = useTranslation();
    const getEmberiNemElnevezes = useGetEmberiNemElnevezes();

    const [uszok, loadingUszok] = useUszokList(props.csapat.id);
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
    }, [t]);

    return (
        <Card className="w-full">
            {loadingUszok ? (
                <CardBody className="grid place-content-center">
                    <Spinner/>
                </CardBody>
            ) : !uszok || !uszok.length ? (
                <CardBody className="grid place-content-center">
                    <Typography>{t("csapat.no_uszok")}</Typography>
                </CardBody>
            ) : (
                <Fragment>
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
                                    <Button variant="text" color="blue-gray" onClick={() => {
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
                    <CardFooter>
                        <Button color="blue" variant="outlined" onClick={doOpenNewUszoModal}>
                            {t("actions.uszo.create")}
                        </Button>
                    </CardFooter>
                </Fragment>
            )}
        </Card>
    );
}

function UszoModal(props: {
    csapat: Csapat
}) {
    const t = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();
    const [uszo, loadingUszo] = useUszoDetails(
        parseInt(searchParams.get(USZO_ID_PARAM_KEY) ?? "-1")
    );

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
        if (!!props.csapat && !!nev && !!szuletesiEv && !!nem) {
            createUszo({
                nev: nev,
                szuletesiEv: szuletesiEv,
                nem: nem,
                csapatId: props.csapat.id
            }).then(message => {
                console.log(message);
                setOpen(false);
            }).catch(console.log);
        }
    }, [setOpen, nem, nev, props.csapat, szuletesiEv]);

    useEffect(() => {
        if (!!uszo) {
            setNev(uszo.nev);
            setSzuletesiEv(uszo.szuletesiEv);
            setNem(uszo.nem as EmberiNemId);
        }
    }, [uszo]);

    return loadingUszo ? <Spinner/> : (
        <Dialog open={open} handler={setOpen}>
            <Card>

                <CardHeader variant="gradient" color="blue-gray"
                            className="p-4 mb-4 text-center
                            flex flex-row items-center justify-center gap-4">
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

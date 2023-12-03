import {useNavigate, useSearchParams} from "react-router-dom";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {formatInterval} from "../../utils/lib/utils";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Dialog,
    IconButton,
    Spinner,
    Typography
} from "@material-tailwind/react";
import {DestructiveButton} from "../../utils/components/buttons";
import {VersenyszamEditLayout} from "../components/VersenyszamEditLayout";
import {DataTable, DataTableDataColumn} from "../../utils/components/data-table";
import {DataTableActionColumn} from "../../utils/components/data-table/DataTableActionColumn";
import {PencilSquareIcon, PlusIcon, TrashIcon} from "@heroicons/react/24/solid";
import {EntryTimeInput} from "../../nevezesek/components/EntryTimeInput";
import {
    useCreateNevezes,
    useDeleteNevezes,
    useEditNevezes,
    useNevezesDetails
} from "../../nevezesek/hooks";
import {useTranslation} from "../../translations/hooks";
import {useDeleteVersenyszam, useEditVersenyszam, useVersenyszamFromContext} from "../hooks";
import {useGetUszasnemElnevezes, useGetVersenyszamNemElnevezes} from "../../utils/hooks";
import {UszasnemId} from "../types";
import {DisplayedNevezes} from "../../nevezesek/types";
import {EmberiNemId} from "../../uszok/types";
import {CsapatSelect} from "../../csapatok/components/CsapatSelect";
import {UszoSelect} from "../../uszok/components/UszoSelect";

const MODAL_PARAM_KEY = "modal";
const NEVEZES_ID_PARAM_KEY = "nevezesId";
const CREATE_NEVEZES_PARAM_VALUE = "createNevezes";
const EDIT_NEVEZES_PARAM_VALUE = "editNevezes";

export function VersenyszamokSlugPage() {
    return (
        <Fragment>
            <div className="w-full flex flex-col gap-12 items-start">
                <VersenyszamDetails/>
                <NevezesekList/>
            </div>
            <CreateNevezesModal/>
            <EditNevezesModal/>
        </Fragment>
    );
}

export function VersenyszamDetails() {
    const t = useTranslation();

    const {versenyszam} = useVersenyszamFromContext();

    const getVersenyszamNemElnevezes = useGetVersenyszamNemElnevezes();
    const getUszasnemElnevezes = useGetUszasnemElnevezes();
    const deleteVersenyszam = useDeleteVersenyszam();
    const navigate = useNavigate();

    const [valto, setValto] = useState<number>(versenyszam.valto ?? 0);
    const [hossz, setHossz] = useState<number>(versenyszam.hossz);
    const [nem, setNem] = useState<EmberiNemId>(versenyszam.nem);
    const [uszasnem, setUszasnem] = useState<UszasnemId>(
        versenyszam.uszasnem
    );

    const elnevezes = useMemo(() => {
        if (!versenyszam) {
            return t("generic_label.loading");
        }

        const valto = versenyszam.valto ? `${versenyszam.valto}x` : "";
        const nem = getVersenyszamNemElnevezes(versenyszam.nem);
        const uszasnem = getUszasnemElnevezes(versenyszam.uszasnem);
        return `${valto}${versenyszam.hossz} ${nem} ${uszasnem}`;
    }, [getUszasnemElnevezes, getVersenyszamNemElnevezes, t, versenyszam]);

    const unsavedChanges = useMemo(() => {
        return (
            versenyszam.valto !== valto ||
            versenyszam.hossz !== hossz ||
            versenyszam.nem !== nem ||
            versenyszam.uszasnem !== uszasnem
        );
    }, [hossz, nem, versenyszam, uszasnem, valto]);

    const editVersenyszam = useEditVersenyszam();

    const doCommitChanges = useCallback(() => {
        editVersenyszam(versenyszam.id, {
            valto: valto === 0 ? undefined : valto,
            emberiNemId: nem,
            hossz: hossz,
            uszasnemId: uszasnem
        }).then(console.log).catch(console.error);
    }, [editVersenyszam, hossz, nem, versenyszam, uszasnem, valto]);

    const doDeleteVersenyszam = useCallback(() => {
        if (!!versenyszam && window.confirm(t("confirm.generic.delete"))) {
            deleteVersenyszam(versenyszam.id).then(message => {
                console.log(message);
                navigate("..");
            }).catch(console.error);
        }
    }, [deleteVersenyszam, navigate, t, versenyszam]);

    return (
        <Card className="w-full mt-6">
            <CardHeader variant="gradient" color="blue-gray"
                        className="p-4 mb-4 text-center
                            flex flex-row items-center justify-center gap-4">
                <Typography variant="h5">
                    {elnevezes}
                </Typography>
            </CardHeader>
            <CardBody className="grid grid-rows-2 grid-cols-2 gap-2">
                <VersenyszamEditLayout valto={valto} hossz={hossz}
                                       versenyszamNem={nem} uszasnem={uszasnem}
                                       setValto={setValto} setHossz={setHossz}
                                       setVersenyszamNem={setNem}
                                       setUszasnem={setUszasnem}/>
            </CardBody>
            <CardFooter className="flex flex-row gap-2">
                {unsavedChanges ? (
                    <Button color="blue" onClick={doCommitChanges}>
                        {t("actions.generic.save_changes")}
                    </Button>
                ) : null}
                <DestructiveButton confirmText={t("actions.versenyszam.delete")}
                                   onClick={doDeleteVersenyszam}>
                    {t("actions.versenyszam.delete")}
                </DestructiveButton>
            </CardFooter>
        </Card>
    );
}

export function NevezesekList() {
    const t = useTranslation();

    const {nevezesek} = useVersenyszamFromContext();
    const deleteNevezes = useDeleteNevezes();
    const [, setSearchParams] = useSearchParams();

    const displayedNevezesek = useMemo<Omit<DisplayedNevezes, "megjelent">[]>(() => {
        return nevezesek.map(value => {
            return {
                id: value.id,
                uszoNev: value.uszo.nev,
                uszoSzuletesiEv: (value.uszo as any)["szuletesiDatum"],
                csapatNev: value.uszo.csapat.nev,
                nevezesiIdo: value.nevezesiIdo ? formatInterval(value.nevezesiIdo) : "nincs",
                idoeredmeny: value.idoeredmeny ? formatInterval(value.idoeredmeny) : "nincs"
            };
        });
    }, [nevezesek]);

    const doDeleteNevezes = useCallback((id: number) => {
        deleteNevezes(id).then(console.log).catch(console.error);
    }, [deleteNevezes]);

    const doOpenCreateNevezesDialog = useCallback(() => {
        setSearchParams(prevState => {
            prevState.set(MODAL_PARAM_KEY, CREATE_NEVEZES_PARAM_VALUE);
            return prevState;
        });
    }, [setSearchParams]);

    const doOpenEditNevezesModalDialog = useCallback((id: number) => {
        setSearchParams(prevState => {
            prevState.set(MODAL_PARAM_KEY, EDIT_NEVEZES_PARAM_VALUE);
            prevState.set(NEVEZES_ID_PARAM_KEY, String(id));
            return prevState;
        });
    }, [setSearchParams]);

    return !nevezesek || !nevezesek.length ? (
        <Card>
            <p>{t("versenyszam.no_uszo")}</p>
        </Card>
    ) : (
        <Card className="w-full">
            <CardHeader variant="gradient" color="blue-gray"
                        className="p-4 mb-4 text-center
                            flex flex-row items-center justify-center gap-4">
                <Typography variant="h5">
                    {t("versenyszam.nevezesek")}
                </Typography>
            </CardHeader>
            <CardBody>
                <DataTable dataList={displayedNevezesek} excludedProperties={["id"]}>
                    <DataTableDataColumn list={displayedNevezesek} forKey="uszoNev"
                                         header={t("generic_label.uszo")} element={value => (
                        <Typography variant="small">{value}</Typography>
                    )}/>
                    <DataTableDataColumn list={displayedNevezesek} forKey="uszoSzuletesiEv"
                                         header={t("generic_label.year_of_birth")}
                                         element={value => (
                                             <Typography variant="small">{value}</Typography>
                                         )}/>
                    <DataTableDataColumn list={displayedNevezesek} forKey="csapatNev"
                                         header={t("generic_label.csapat")}
                                         element={value => (
                                             <Typography variant="small">{value}</Typography>
                                         )}/>
                    <DataTableDataColumn list={displayedNevezesek} forKey="nevezesiIdo"
                                         header={t("generic_label.nevezesi_ido")}
                                         element={value => (
                                             <Typography variant="small">{value}</Typography>
                                         )}/>
                    <DataTableDataColumn list={displayedNevezesek} forKey="idoeredmeny"
                                         header={t("generic_label.idoeredmeny")}
                                         element={value => (
                                             <Typography variant="small">{value}</Typography>
                                         )}/>
                    <DataTableActionColumn list={displayedNevezesek} element={entry => (
                        <div className="flex flex-row gap-1">
                            <IconButton variant="outlined" color="blue-gray" onClick={() => {
                                doOpenEditNevezesModalDialog(entry.id);
                            }} size="sm">
                                <PencilSquareIcon className="h-5"/>
                            </IconButton>
                            <IconButton variant="outlined" color="red" onClick={() => {
                                doDeleteNevezes(entry.id);
                            }} size="sm">
                                <TrashIcon className="h-5"/>
                            </IconButton>
                        </div>
                    )}/>
                </DataTable>
            </CardBody>
            <CardFooter>
                <Button color="blue" variant="outlined" onClick={doOpenCreateNevezesDialog}>
                    {t("actions.versenyszam.add_uszo")}
                </Button>
            </CardFooter>
        </Card>
    );
}

function CreateNevezesModal() {
    const t = useTranslation();

    const {versenyszam} = useVersenyszamFromContext();

    const [searchParams, setSearchParams] = useSearchParams();
    const createNevezes = useCreateNevezes();

    const [csapat, setCsapat] = useState<number>(NaN);
    const [uszo, setUszo] = useState<number>(NaN);
    const [nevezesiIdo, setNevezesiIdo] = useState<string>();

    const open = useMemo(() => {
        return searchParams.has(MODAL_PARAM_KEY) &&
            searchParams.get(MODAL_PARAM_KEY) === CREATE_NEVEZES_PARAM_VALUE;
    }, [searchParams]);

    const setOpen = useCallback((open: boolean) => {
        setSearchParams(state => {
            if (open) state.set(MODAL_PARAM_KEY, CREATE_NEVEZES_PARAM_VALUE);
            else state.delete(MODAL_PARAM_KEY);

            return state;
        });

        if (!open) {
            setCsapat(NaN);
            setUszo(NaN);
        }
    }, [setSearchParams]);

    const canComplete = useMemo(() => {
        return !!uszo && !!nevezesiIdo && !nevezesiIdo.includes("_");
    }, [nevezesiIdo, uszo]);

    const doComplete = useCallback(() => {
        if (!canComplete) {
            return;
        }

        createNevezes({
            megjelent: true,
            nevezesiIdo: nevezesiIdo,
            versenyszamId: versenyszam.id,
            uszoId: uszo!
        }).then(message => {
            console.log(message);
            setOpen(false);
        }).catch(console.error);
    }, [canComplete, createNevezes, setOpen, nevezesiIdo, versenyszam, uszo]);

    useEffect(() => {
        setUszo(NaN);
    }, [csapat]);

    return (
        <Dialog open={open} handler={setOpen}>
            <Card>
                <CardHeader color="blue-gray"
                            className="p-4 mb-4 text-center
                            flex flex-row items-center justify-center gap-4">
                    <PlusIcon className="w-8"/>
                    <Typography variant="h5">
                        {t("actions.versenyszam.add_uszo")}
                    </Typography>
                </CardHeader>
                <CardBody className="flex flex-col gap-2">
                    <CsapatSelect selected={csapat} onSelect={setCsapat}/>
                    {csapat ? (
                        <UszoSelect csapatId={csapat} selected={uszo}
                                    onSelect={setUszo}/>
                    ) : null}
                    {uszo ? (
                        <EntryTimeInput value={nevezesiIdo} onValue={setNevezesiIdo}/>
                    ) : null}
                </CardBody>
                <CardFooter className="flex flex-row gap-2">
                    <Button color="blue" variant="outlined" fullWidth
                            onClick={() => setOpen(false)}>
                        {t("generic_label.rather_not")}
                    </Button>
                    <Button color="blue" variant="filled" fullWidth
                            onClick={doComplete} disabled={!canComplete}>
                        {t("generic_label.lets_go")}
                    </Button>
                </CardFooter>
            </Card>
        </Dialog>
    );
}

function EditNevezesModal() {
    const t = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();
    const [nevezes, loadingNevezes] = useNevezesDetails(parseInt(
        searchParams.get(NEVEZES_ID_PARAM_KEY) ?? "-1"
    ));

    const editNevezes = useEditNevezes();

    const [nevezesiIdo, setNevezesiIdo] = useState<string>();

    const open = useMemo(() => {
        return searchParams.has(MODAL_PARAM_KEY) &&
            searchParams.get(MODAL_PARAM_KEY) === EDIT_NEVEZES_PARAM_VALUE;
    }, [searchParams]);

    const setOpen = useCallback((open: boolean) => {
        setSearchParams(state => {
            if (open) {
                state.set(MODAL_PARAM_KEY, EDIT_NEVEZES_PARAM_VALUE);
            } else {
                state.delete(MODAL_PARAM_KEY);
                state.delete(NEVEZES_ID_PARAM_KEY);
            }

            return state;
        });

        if (!open) {
            setNevezesiIdo(undefined);
        }
    }, [setSearchParams]);

    const doComplete = useCallback(() => {
        if (!!nevezes) {
            editNevezes(nevezes.id, {
                nevezesiIdo: nevezesiIdo
            }).then(console.log).catch(console.error).finally(() => {
                setOpen(false);
            });
        }
    }, [editNevezes, nevezes, nevezesiIdo, setOpen]);

    useEffect(() => {
        if (!!nevezes) {
            setNevezesiIdo(formatInterval(nevezes.nevezesiIdo));
        }
    }, [nevezes]);

    return (
        <Dialog open={open} handler={setOpen}>
            {loadingNevezes || !nevezes ? <Spinner/> : (
                <Card>
                    <CardBody className="flex flex-col gap-4">
                        <Typography variant="lead">{nevezes.uszo.nev}</Typography>
                        <EntryTimeInput value={nevezesiIdo} onValue={setNevezesiIdo}/>
                    </CardBody>
                    <CardFooter className="flex flex-row gap-2">
                        <Button color="blue" variant="outlined" fullWidth
                                onClick={() => setOpen(false)}>
                            {t("generic_label.rather_not")}
                        </Button>
                        <Button color="blue" variant="filled" fullWidth
                                onClick={doComplete}>
                            {t("generic_label.lets_go")}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </Dialog>
    );
}

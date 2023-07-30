import {Link, useParams, useSearchParams} from "react-router-dom";
import {useCsapatDetails} from "../hooks/csapatok/useCsapatDetails";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {useUszokList} from "../hooks/uszok/useUszokList";
import {TextInput} from "../components/inputs/TextInput";
import {EmberiNemId} from "../types/EmberiNemId";
import {NumberInput} from "../components/inputs/NumberInput";
import {useSetAdminLayoutTitle} from "../hooks/useSetAdminLayoutTitle";
import {useUszoDetails} from "../hooks/uszok/useUszoDetails";
import {useDeleteCsapat} from "../hooks/csapatok/useDeleteCsapat";
import {useEditCsapat} from "../hooks/csapatok/useEditCsapat";
import {Csapat} from "../types/model/Csapat";
import {useDeleteUszo} from "../hooks/uszok/useDeleteUszo";
import {useCreateUszo} from "../hooks/uszok/useCreateUszo";
import {useTranslation} from "../hooks/translations/useTranslation";
import {useGetEmberiNemElnevezes} from "../hooks/useGetEmberiNemElnevezes";
import {FullPageModalWithActions} from "../components/modals/FullPageModalWithActions";
import {EmberiNemSelect} from "../components/selects";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Input,
    Spinner,
    Typography
} from "@material-tailwind/react";
import {DestructiveButton} from "../components/buttons";

export function CsapatokSlugPage() {
    const t = useTranslation();

    const {id} = useParams();
    const idNumber = useMemo(() => parseInt(id ?? "-1"), [id]);

    const [searchParams] = useSearchParams();

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
        <div className="p-4 w-full flex flex-col gap-4">
            <CsapatDetailsForm csapat={csapat}/>
            <UszokList csapat={csapat}/>
            {searchParams.get("modal") === "uszo" ? (
                <UszoModal csapat={csapat}/>
            ) : null}
        </div>
    );
}

function CsapatDetailsForm(props: {
    csapat: Csapat
}) {
    const t = useTranslation();
    const deleteCsapat = useDeleteCsapat();
    const editCsapat = useEditCsapat();

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
    }, [editCsapat, nev, props.csapat, varos]);

    const doDelete = useCallback(() => {
        if (!!props.csapat) {
            deleteCsapat(props.csapat.id).then(console.log);
        }
    }, [props.csapat, deleteCsapat]);

    useEffect(() => {
        setIsDirty(props.csapat.nev !== nev || props.csapat.varos !== varos);
    }, [nev, props.csapat, varos]);

    return (
        <Card className="w-full">
            <CardHeader variant="gradient" color="blue" className="p-4 mb-4 text-center">
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

    const [uszok, uszokLoading] = useUszokList(props.csapat.id);
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
            prevState.set("modal", "uszo");
            prevState.set("uszoId", String(id));
            return prevState;
        });
    }, [setSearchParams]);

    const doOpenNewUszoModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.set("modal", "uszo");
            return prevState;
        });
    }, [setSearchParams]);

    const doDeleteUszo = useCallback((id: number) => {
        deleteUszo(id).then(console.log).catch(console.error);
    }, [deleteUszo]);

    return (
        <Fragment>
            {uszokLoading ? (
                <div className="grid place-content-center">
                    <Spinner/>
                </div>
            ) : !uszok || !uszok.length ? (
                <Card>
                    <p>{t("csapat.no_uszok")}</p>
                </Card>
            ) : (
                <Fragment></Fragment>
                // <DataTable dataList={displayedUszok} propertyNameOverride={{
                //     nev: t("generic_label.name"),
                //     szuletesiEv: t("generic_label.year_of_birth")
                // }} excludedProperties={["id", "csapatId"]}
                //            actionColumn={({id}) => (
                //                <Fragment>
                //                    <IconButton color="blue" onClick={() => {
                //                        doOpenEditUszoModal(id);
                //                    }}>
                //                        <PencilIcon className="w-5"/>
                //                    </IconButton>
                //                    <DestructiveIconButton confirmText={t("confirm.generic.delete")}
                //                                           onConfirm={() => {
                //                                               doDeleteUszo(id);
                //                                           }}>
                //                        <TrashIcon className="w-5"/>
                //                    </DestructiveIconButton>
                //                </Fragment>
                //            )}/>
            )}
            <Button color="blue" variant="outlined" onClick={doOpenNewUszoModal}>
                {t("actions.uszo.create")}
            </Button>
        </Fragment>
    );
}

function UszoModal(props: {
    csapat?: Csapat
}) {
    const t = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();
    const [uszo, loadingUszo] = useUszoDetails(
        parseInt(searchParams.get("uszoId") ?? "-1")
    );
    const createUszo = useCreateUszo();

    const [nev, setNev] = useState("");
    const [szuletesiEv, setSzuletesiEv] = useState((new Date()).getFullYear());
    const [nem, setNem] = useState<EmberiNemId>("NEM_NO");

    const canCreateUszo = useMemo(() => {
        return !!nev && !!szuletesiEv && !!nem;
    }, [nem, nev, szuletesiEv]);

    const modalTitle = useMemo(() => {
        return searchParams.has("uszoId") ?
            t("actions.uszo.edit") :
            t("actions.uszo.create");
    }, [searchParams, t]);

    const doDismiss = useCallback(() => {
        setSearchParams(prevState => {
            prevState.delete("modal");
            prevState.delete("uszoId");
            return prevState;
        });
    }, [setSearchParams]);

    const doComplete = useCallback(() => {
        if (!!props.csapat && !!nev && !!szuletesiEv && !!nem) {
            createUszo({
                nev: nev,
                szuletesiEv: szuletesiEv,
                nem: nem,
                csapatId: props.csapat.id
            }).then(message => {
                console.log(message);
                doDismiss();
            }).catch(console.log);
        }
    }, [createUszo, doDismiss, nem, nev, props.csapat, szuletesiEv]);

    useEffect(() => {
        if (!!uszo) {
            setNev(uszo.nev);
            setSzuletesiEv(uszo.szuletesiEv);
            setNem(uszo.nem as EmberiNemId);
        }
    }, [uszo]);

    return (
        <FullPageModalWithActions icon="person" title={modalTitle}
                                  onComplete={doComplete} onDismiss={doDismiss}
                                  className="flex flex-col gap-2 p-6"
                                  canComplete={canCreateUszo}>
            {loadingUszo ? (
                <Spinner/>
            ) : (
                <Fragment>
                    <TextInput value={nev} onValue={setNev}
                               placeholder={t("uszo.name")}/>
                    <div className="grid grid-rows-2 grid-cols-[auto_auto]
                        gap-y-2 gap-x-8 items-center">
                        <label>{t("uszo.year_of_birth")}</label>
                        <NumberInput value={szuletesiEv}
                                     onValue={setSzuletesiEv}
                                     min={1980}
                                     max={(new Date()).getFullYear()}/>
                        <label>Nem:</label>
                        <EmberiNemSelect selected={nem} onSelect={setNem}/>
                    </div>
                </Fragment>
            )}
        </FullPageModalWithActions>
    );
}

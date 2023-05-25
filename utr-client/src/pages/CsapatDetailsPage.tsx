import {Link, useParams, useSearchParams} from "react-router-dom";
import {useCsapatDetails} from "../hooks/csapatok/useCsapatDetails";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {LoadingSpinner} from "../components/LoadingSpinner";
import {PrimaryButton} from "../components/inputs/PrimaryButton";
import {WarningButton} from "../components/inputs/WarningButton";
import {useUszokList} from "../hooks/uszok/useUszokList";
import {DataTable} from "../components/tables/DataTable";
import {FullPageModal} from "../components/modals/FullPageModal";
import {TextInput} from "../components/inputs/TextInput";
import {SecondaryButton} from "../components/inputs/SecondaryButton";
import {TitleIcon} from "../components/icons/TitleIcon";
import {EmberiNem} from "../types/EmberiNem";
import {Dropdown} from "../components/inputs/Dropdown";
import {NumberInput} from "../components/inputs/NumberInput";
import {useSetAdminLayoutTitle} from "../hooks/useSetAdminLayoutTitle";
import {IconButton} from "../components/inputs/IconButton";
import {BorderCard} from "../components/containers/BorderCard";
import {useUszoDetails} from "../hooks/uszok/useUszoDetails";
import {useDeleteCsapat} from "../hooks/csapatok/useDeleteCsapat";
import {useEditCsapat} from "../hooks/csapatok/useEditCsapat";
import {IconWarningButton} from "../components/inputs/IconWarningButton";
import {Csapat} from "../types/Csapat";
import {useDeleteUszo} from "../hooks/uszok/useDeleteUszo";
import {useCreateUszo} from "../hooks/uszok/useCreateUszo";
import {useAuthUser} from "../hooks/auth/useAuthUser";

export function CsapatDetailsPage() {
    const {id} = useParams();
    const idNumber = useMemo(() => parseInt(id ?? "-1"), [id]);

    const [searchParams, setSearchParams] = useSearchParams();

    const [csapat, csapatLoading] = useCsapatDetails(idNumber);
    const deleteCsapat = useDeleteCsapat();

    const doOpenEditCsapatModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.set("modal", "csapat");
            return prevState;
        });
    }, [setSearchParams]);

    const doDelete = useCallback(() => {
        if (!!csapat) {
            deleteCsapat(csapat.id).then(console.log);
        }
    }, [csapat, deleteCsapat]);

    useSetAdminLayoutTitle(!csapat ? "Betöltés..." : csapat.nev);

    return csapatLoading ? (
        <div className="w-full h-full grid place-content-center">
            <LoadingSpinner/>
        </div>
    ) : !csapat ? (
        <div className="h-full grid place-content-center">
            <div className="flex flex-col gap-2 items-center">
                <p>Csapat nem található</p>
                <Link to=".." relative="path">
                    <PrimaryButton text="Vissza"/>
                </Link>
            </div>
        </div>
    ) : (
        <Fragment>
            <div className="w-full flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h3 className="ml-2">Általános információ:</h3>
                    <BorderCard className="grid grid-cols-2">
                        <p>Város: </p>
                        <p><b>{csapat.varos}</b></p>
                    </BorderCard>
                    <div className="flex flex-row gap-2">
                        <PrimaryButton text="Csapat adatainak szerkesztése"
                                       onClick={doOpenEditCsapatModal}/>
                        <WarningButton text="Csapat törlése" onClick={doDelete}/>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="ml-2 col-span-2">Úszók:</h3>
                    <UszokList csapat={csapat}/>
                </div>
            </div>
            {searchParams.get("modal") === "csapat" ? (
                <CsapatModal csapat={csapat}/>
            ) : searchParams.get("modal") === "uszo" ? (
                <UszoModal csapat={csapat}/>
            ) : null}
        </Fragment>
    );
}

function UszokList(props: {
    csapat?: Csapat
}) {
    const [uszok, uszokLoading] = useUszokList(props.csapat?.id);
    const deleteUszo = useDeleteUszo();
    const [, setSearchParams] = useSearchParams();

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
                    <LoadingSpinner/>
                </div>
            ) : !uszok || !uszok.length ? (
                <BorderCard>
                    <p>
                        Jelenleg egy úszó sincs felvéve a csapatba.
                        Adjunk hozzá egyet?
                    </p>
                </BorderCard>
            ) : (
                <DataTable dataList={uszok} propertyNameOverride={{
                    nev: "név",
                    szuletesiEv: "születési év"
                }} excludedProperties={["id", "csapatId"]}
                           actionColumn={({id}) => (
                               <Fragment>
                                   <IconButton iconName="edit"
                                               onClick={() => {
                                                   doOpenEditUszoModal(id);
                                               }}/>
                                   <IconWarningButton iconName="delete"
                                                      onClick={() => {
                                                          doDeleteUszo(id);
                                                      }}/>
                               </Fragment>
                           )}/>
            )}
            <SecondaryButton text="Úszó hozzáadása"
                             onClick={doOpenNewUszoModal}/>
        </Fragment>
    );
}

function CsapatModal(props: {
    csapat?: Csapat
}) {
    const [, setSearchParams] = useSearchParams();
    const editCsapat = useEditCsapat();

    const [nev, setNev] = useState(props.csapat?.nev ?? "");
    const [varos, setVaros] = useState(props.csapat?.varos ?? "");

    const doCloseModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.delete("modal");
            return prevState;
        });
    }, [setSearchParams]);

    const doEdit = useCallback(() => {
        if (!!props.csapat) {
            editCsapat(props.csapat.id, {
                nev: nev, varos: varos
            }).then(console.log);
            doCloseModal();
        }
    }, [props.csapat, editCsapat, nev, varos, doCloseModal]);

    useEffect(() => {
        if (!!props.csapat) {
            setNev(props.csapat.nev);
            setVaros(props.csapat.varos);
        }
    }, [props.csapat]);

    return (
        <FullPageModal className="flex flex-col">
            <div className="flex flex-row items-center justify-start gap-6 p-6
            min-w-max max-w-sm">
                <TitleIcon name="edit"/>
                <h2>Csapat szerkesztése</h2>
            </div>
            <div className="w-full border border-slate-100"></div>
            <div className="flex flex-col gap-2 p-6">
                <TextInput value={nev} onValue={setNev}
                           placeholder="Csapat neve"/>
                <TextInput value={varos} onValue={setVaros}
                           placeholder="Város"/>
            </div>
            <div className="flex flex-row gap-2 p-6">
                <SecondaryButton text="Inkább nem" onClick={doCloseModal}/>
                <PrimaryButton text="Mehet!" onClick={doEdit}/>
            </div>
        </FullPageModal>
    );
}

function UszoModal(props: {
    csapat?: Csapat
}) {
    const user = useAuthUser();
    const [searchParams, setSearchParams] = useSearchParams();
    const [uszo, uszoLoading] = useUszoDetails(
        parseInt(searchParams.get("uszoId") ?? "-1")
    );
    const createUszo = useCreateUszo();

    const [nev, setNev] = useState("");
    const [szuletesiEv, setSzuletesiEv] = useState((new Date()).getFullYear());
    const [nem, setNem] = useState<EmberiNem>("N");

    const canCreateUszo = useMemo(() => {
        return !!nev && !!szuletesiEv && !!nem;
    }, [nem, nev, szuletesiEv]);

    const doCloseModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.delete("modal");
            prevState.delete("uszoId");
            return prevState;
        });
    }, [setSearchParams]);

    const doCreateUszo = useCallback(() => {
        if (!!user && !!props.csapat && !!nev && !!szuletesiEv && !!nem) {
            createUszo({
                nev: nev,
                szuletesiEv: szuletesiEv,
                nem: nem,
                csapatId: props.csapat.id
            }).then(message => {
                console.log(message);
                doCloseModal();
            }).catch(console.log);
        }
    }, [createUszo, doCloseModal, nem, nev, props.csapat, szuletesiEv, user]);

    useEffect(() => {
        if (!!uszo) {
            setNev(uszo.nev);
            setSzuletesiEv(uszo.szuletesiEv);
            setNem(uszo.nem as EmberiNem);
        }
    }, [uszo]);

    return (
        <FullPageModal className="flex flex-col">
            {searchParams.has("uszoId") && uszoLoading ? (
                <LoadingSpinner/>
            ) : (
                <Fragment>
                    <div className="flex flex-row items-center
                    justify-start gap-6 p-6 min-w-max max-w-sm">
                        <TitleIcon name="person"/>
                        <h2>
                            {searchParams.has("uszoId") ? "Úszó szerkesztése" :
                                "Úszó hozzáadása"}
                        </h2>
                    </div>
                    <div className="w-full border border-slate-100"></div>
                    <div className="flex flex-col gap-2 p-6">
                        <TextInput value={nev} onValue={setNev} placeholder={"Név"}/>
                        <div className="grid grid-rows-2 grid-cols-[auto_auto]
                        gap-y-2 gap-x-8 items-center">
                            <label>Születési év:</label>
                            <NumberInput value={szuletesiEv}
                                         onValue={setSzuletesiEv}
                                         min={1980}
                                         max={(new Date()).getFullYear()}/>
                            <label>Nem:</label>
                            <Dropdown options={{"N": "Nő", "F": "Férfi"}}
                                      onSelect={() => {
                                      }}/>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 p-6">
                        <SecondaryButton text="Inkább nem"
                                         onClick={doCloseModal}/>
                        <PrimaryButton text="Mehet!"
                                       onClick={doCreateUszo}
                                       disabled={!canCreateUszo}/>
                    </div>
                </Fragment>
            )}
        </FullPageModal>
    );
}

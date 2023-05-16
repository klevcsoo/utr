import {Link, useParams, useSearchParams} from "react-router-dom";
import {useCsapatDetails} from "../hooks/useCsapatDetails";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {LoadingSpinner} from "../components/LoadingSpinner";
import {PrimaryButton} from "../components/inputs/PrimaryButton";
import {WarningButton} from "../components/inputs/WarningButton";
import {useUszokList} from "../hooks/useUszokList";
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
import {useUszoDetails} from "../hooks/useUszoDetails";

export function CsapatDetailsPage() {
    const {id} = useParams();
    const idNumber = useMemo<number | undefined>(() => {
        return !id ? undefined : parseInt(id);
    }, [id]);

    const [searchParams, setSearchParams] = useSearchParams();

    const [csapat, csapatLoading] = useCsapatDetails(idNumber);
    const [uszok, uszokLoading] = useUszokList(idNumber);

    const doOpenEditCsapatModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.set("modal", "csapat");
            return prevState;
        });
    }, [setSearchParams]);

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

    const doDelete = useCallback(() => {
        if (!!csapat) {
            csapat.delete();
        }
    }, [csapat]);

    useSetAdminLayoutTitle(!csapat ? "Betöltés..." : csapat.details.nev);

    return csapatLoading ? (
        <div className="h-full grid place-content-center">
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
            <div className="w-full p-8 flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h3 className="ml-2">Általános információ:</h3>
                    <BorderCard className="grid grid-cols-2">
                        <p>Város: </p>
                        <p><b>{csapat.details.varos}</b></p>
                        <p>Úszók száma:</p>
                        <p><b>{uszok.length}</b></p>
                    </BorderCard>
                    <div className="flex flex-row gap-2">
                        <PrimaryButton text="Csapat adatainak szerkesztése"
                                       onClick={doOpenEditCsapatModal}/>
                        <WarningButton text="Csapat törlése" onClick={doDelete}/>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="ml-2 col-span-2">Úszók:</h3>
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
                            szuletesiDatum: "születési év"
                        }} excludedProperties={["id", "csapatId"]}
                                   actionColumn={({id}) => (
                                       <IconButton iconName="edit"
                                                   onClick={() => {
                                                       doOpenEditUszoModal(id);
                                                   }}/>
                                   )}/>
                    )}
                    <SecondaryButton text="Úszó hozzáadása"
                                     onClick={doOpenNewUszoModal}/>
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

function CsapatModal(props: {
    csapat: ReturnType<typeof useCsapatDetails>[0]
}) {
    const [, setSearchParams] = useSearchParams();

    const [nev, setNev] = useState(props.csapat?.details.nev ?? "");
    const [varos, setVaros] = useState(props.csapat?.details.varos ?? "");

    const doCloseModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.delete("modal");
            return prevState;
        });
    }, [setSearchParams]);

    const doEdit = useCallback(() => {
        if (!!props.csapat) {
            props.csapat.edit({nev: nev, varos: varos});
            doCloseModal();
        }
    }, [props.csapat, nev, varos, doCloseModal]);

    useEffect(() => {
        if (!!props.csapat) {
            setNev(props.csapat.details.nev);
            setVaros(props.csapat.details.varos);
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
    csapat: ReturnType<typeof useCsapatDetails>[0]
}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [uszo, uszoLoading] = useUszoDetails(
        parseInt(searchParams.get("uszoId") ?? "-1")
    );

    const [nev, setNev] = useState("");
    const [szuletesiEv, setSzuletesiEv] = useState((new Date()).getFullYear());
    const [nem, setNem] = useState<EmberiNem>("N");

    const doCloseModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.delete("modal");
            return prevState;
        });
    }, [setSearchParams]);

    useEffect(() => {
        if (!!uszo) {
            setNev(uszo.nev);
            setSzuletesiEv(uszo.szuletesiDatum);
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
                        <h2>Úszó hozzáadása</h2>
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
                        <PrimaryButton text="Mehet!"/>
                    </div>
                </Fragment>
            )}
        </FullPageModal>
    );
}

import {Link, Outlet, Route, Routes, useParams} from "react-router-dom";
import {useCsapatDetails} from "../hooks/useCsapatDetails";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {LoadingSpinner} from "../components/LoadingSpinner";
import {PrimaryButton} from "../components/inputs/PrimaryButton";
import {WarningButton} from "../components/inputs/WarningButton";
import {useUszokList} from "../hooks/useUszokList";
import {DataTable} from "../components/tables/DataTable";
import {FullPagePopup} from "../components/popups/FullPagePopup";
import {TextInput} from "../components/inputs/TextInput";
import {SecondaryButton} from "../components/inputs/SecondaryButton";
import {TitleIcon} from "../components/icons/TitleIcon";
import {EmberiNem} from "../types/EmberiNem";
import {Dropdown} from "../components/inputs/Dropdown";
import {NumberInput} from "../components/inputs/NumberInput";
import {useSetAdminLayoutTitle} from "../hooks/useSetAdminLayoutTitle";
import {IconButton} from "../components/inputs/IconButton";
import {BorderCard} from "../components/containers/BorderCard";

export function CsapatDetailsPage() {
    const {id} = useParams();
    const idNumber = useMemo<number | undefined>(() => {
        return !id ? undefined : parseInt(id);
    }, [id]);
    const [csapat, csapatLoading] = useCsapatDetails(idNumber);
    const [uszok, uszokLoading] = useUszokList(idNumber);

    useSetAdminLayoutTitle(!csapat ? "Betöltés..." : csapat.details.nev);

    return (
        <Routes>
            <Route path="/" element={(
                <Fragment>
                    <DetailsPage csapat={csapat} csapatLoading={csapatLoading}
                                 uszok={uszok} uszokLoading={uszokLoading}/>
                    <Outlet/>
                </Fragment>
            )}>
                <Route path="edit" element={(
                    <EditCsapatPopup csapat={csapat}
                                     csapatLoading={csapatLoading}/>
                )}/>
                <Route path="new" element={(
                    <NewUszoPopup csapat={csapat} csapatLoading={csapatLoading}/>
                )}/>
            </Route>
        </Routes>
    );
}

function DetailsPage(props: {
    csapat: ReturnType<typeof useCsapatDetails>[0]
    csapatLoading: boolean
    uszok: ReturnType<typeof useUszokList>[0]
    uszokLoading: boolean
}) {
    const doDelete = useCallback(() => {
        if (!!props.csapat) {
            props.csapat.delete();
        }
    }, [props.csapat]);

    return props.csapatLoading ? (
        <div className="h-full grid place-content-center">
            <LoadingSpinner/>
        </div>
    ) : !props.csapat ? (
        <div className="h-full grid place-content-center">
            <div className="flex flex-col gap-2 items-center">
                <p>Csapat nem található</p>
                <Link to={"/overview/csapatok"}>
                    <PrimaryButton text="Vissza"/>
                </Link>
            </div>
        </div>
    ) : (
        <div className="w-full p-8 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h3 className="ml-2">Általános információ:</h3>
                <BorderCard className="grid grid-cols-2">
                    <p>Város: </p>
                    <p><b>{props.csapat.details.varos}</b></p>
                    <p>Úszók száma:</p>
                    <p><b>{props.uszok.length}</b></p>
                </BorderCard>
                <div className="flex flex-row gap-2">
                    <Link to="edit">
                        <PrimaryButton text="Csapat adatainak szerkesztése"/>
                    </Link>
                    <WarningButton text="Csapat törlése" onClick={doDelete}/>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="ml-2 col-span-2">Úszók:</h3>
                {props.uszokLoading ? (
                    <div className="grid place-content-center">
                        <LoadingSpinner/>
                    </div>
                ) : !props.uszok || !props.uszok.length ? (
                    <BorderCard>
                        <p>
                            Jelenleg egy úszó sincs felvéve a csapatba.
                            Adjunk hozzá egyet?
                        </p>
                    </BorderCard>
                ) : (
                    <Fragment>
                        <DataTable dataList={props.uszok} propertyNameOverride={{
                            nev: "név",
                            szuletesiDatum: "születési év"
                        }} excludedProperties={["id", "csapatId"]}
                                   actionColumn={entry => (
                                       <Link to={`uszok/${entry.id}/edit`}>
                                           <IconButton iconName="edit"/>
                                       </Link>
                                   )}/>
                    </Fragment>
                )}
                <Link to="new">
                    <SecondaryButton text="Úszó hozzáadása"/>
                </Link>
            </div>
        </div>
    );
}

function EditCsapatPopup(props: {
    csapat: ReturnType<typeof useCsapatDetails>[0]
    csapatLoading: boolean
}) {
    const [nev, setNev] = useState(props.csapat?.details.nev ?? "");
    const [varos, setVaros] = useState(props.csapat?.details.varos ?? "");

    const doEdit = useCallback(() => {
        if (!!props.csapat) {
            props.csapat.edit({nev: nev, varos: varos});
        }
    }, [props.csapat, nev, varos]);

    useEffect(() => {
        if (!!props.csapat) {
            setNev(props.csapat.details.nev);
            setVaros(props.csapat.details.varos);
        }
    }, [props.csapat]);

    return props.csapatLoading ? <LoadingSpinner/> : (
        <FullPagePopup className="flex flex-col">
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
                <Link to=".." className="w-full">
                    <SecondaryButton text="Inkább nem"/>
                </Link>
                <PrimaryButton text="Mehet!" onClick={doEdit}/>
            </div>
        </FullPagePopup>
    );
}

function NewUszoPopup(props: {
    csapat: ReturnType<typeof useCsapatDetails>[0]
    csapatLoading: boolean
}) {
    const [nev, setNev] = useState("");
    const [szuletesiEv, setSzuletesiEv] = useState((new Date()).getFullYear());
    const [nem, setNem] = useState<EmberiNem>("N");

    return (
        <FullPagePopup className="flex flex-col">
            <div className="flex flex-row items-center justify-start gap-6 p-6
            min-w-max max-w-sm">
                <TitleIcon name="person"/>
                <h2>Úszó hozzáadása</h2>
            </div>
            <div className="w-full border border-slate-100"></div>
            <div className="flex flex-col gap-2 p-6">
                <TextInput value={nev} onValue={setNev} placeholder={"Név"}/>
                <div className="grid grid-rows-2 grid-cols-[auto_auto]
                gap-y-2 gap-x-8 items-center">
                    <label>Születési év:</label>
                    <NumberInput value={szuletesiEv} onValue={setSzuletesiEv}
                                 min={1980} max={(new Date()).getFullYear()}/>
                    <label>Nem:</label>
                    <Dropdown options={{"N": "Nő", "F": "Férfi"}} onSelect={() => {
                    }}/>
                </div>
            </div>
            <div className="flex flex-row gap-2 p-6">
                <Link to=".." className="w-full">
                    <SecondaryButton text="Inkább nem"/>
                </Link>
                <PrimaryButton text="Mehet!"/>
            </div>
        </FullPagePopup>
    );
}

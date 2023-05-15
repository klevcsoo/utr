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

export function CsapatDetailsPage() {
    return (
        <Routes>
            <Route path="/" element={(
                <Fragment>
                    <DetailsPage/>
                    <Outlet/>
                </Fragment>
            )}>
                <Route path="edit" element={<EditCsapatPopup/>}/>
            </Route>
        </Routes>
    );
}

function DetailsPage() {
    const {id} = useParams();
    const idNumber = useMemo<number | undefined>(() => {
        return !id ? undefined : parseInt(id);
    }, [id]);
    const [csapat, csapatLoading] = useCsapatDetails(idNumber);
    const [uszok, uszokLoading] = useUszokList(idNumber);

    const doDelete = useCallback(() => {
        if (!!csapat) {
            csapat.delete();
        }
    }, [csapat]);

    return csapatLoading ? (
        <div className="h-full grid place-content-center">
            <LoadingSpinner/>
        </div>
    ) : !csapat ? (
        <div className="h-full grid place-content-center">
            <div className="flex flex-col gap-2 items-center">
                <p>Csapat nem található</p>
                <Link to={"/overview/csapatok"}>
                    <PrimaryButton text="Vissza" onClick={() => {
                    }}/>
                </Link>
            </div>
        </div>
    ) : (
        <div className="w-full p-8 flex flex-col gap-2">
            <h1 className="text-5xl w-full"><b>{csapat.details.nev}</b></h1>
            <h2 className="text-2xl text-slate-500 mb-4">{csapat.details.varos}</h2>
            <div className="flex flex-row gap-2">
                <Link to="edit">
                    <PrimaryButton text="Csapat adatainak szerkesztése" onClick={() => {
                    }}/>
                </Link>
                <WarningButton text="Csapat törlése" onClick={doDelete}/>
            </div>
            {uszokLoading ? (
                <div className="grid place-content-center">
                    <LoadingSpinner/>
                </div>
            ) : !uszok ? null : (
                <Fragment>
                    <h3 className="text-xl mt-4">Úszók:</h3>
                    <DataTable dataList={uszok} propertyNameOverride={{
                        nev: "név",
                        szuletesiDatum: "születési év"
                    }} excludedProperties={["id", "csapatId"]} actionColumn={entry => (
                        <Link to={`uszok/${entry.id}/edit`}>
                            <button type="button" className="grid place-content-center
                            p-1 bg-slate-100 rounded-md hover:bg-blue-500 group">
                                <span className="material-symbols-rounded text-inherit
                                group-hover:text-white">
                                    edit
                                </span>
                            </button>
                        </Link>
                    )}/>
                    <Link to="new">
                        <PrimaryButton text="Úszó hozzáadása" onClick={() => {
                        }}/>
                    </Link>
                </Fragment>
            )}
        </div>
    );
}

function EditCsapatPopup() {
    const {id} = useParams();
    const idNumber = useMemo<number | undefined>(() => {
        return !id ? undefined : parseInt(id);
    }, [id]);
    const [csapat, csapatLoading] = useCsapatDetails(idNumber);

    const [nev, setNev] = useState(csapat?.details.nev ?? "");
    const [varos, setVaros] = useState(csapat?.details.varos ?? "");

    const doEdit = useCallback(() => {
        if (!!csapat) {
            csapat.edit({nev: nev, varos: varos});
        }
    }, [csapat, nev, varos]);

    useEffect(() => {
        if (!!csapat) {
            setNev(csapat.details.nev);
            setVaros(csapat.details.varos);
        }
    }, [csapat]);

    return csapatLoading ? <LoadingSpinner/> : (
        <FullPagePopup>
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl text-center mb-4">Csapat szerkesztése</h2>
                <TextInput value={nev} onValue={setNev}
                           placeholder="Csapat neve"/>
                <TextInput value={varos} onValue={setVaros}
                           placeholder="Város"/>
                <PrimaryButton text="Mehet!" onClick={doEdit}/>
                <Link to=".." className="w-full">
                    <SecondaryButton text="Inkább nem" onClick={() => {
                    }}/>
                </Link>
            </div>
        </FullPagePopup>
    );
}

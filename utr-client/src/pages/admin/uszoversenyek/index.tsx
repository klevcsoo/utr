import {useUszoversenyekList} from "../../../hooks/uszoversenyek/useUszoversenyekList";
import {Link, useSearchParams} from "react-router-dom";
import {useSetAdminLayoutTitle} from "../../../hooks/useSetAdminLayoutTitle";
import {LoadingSpinner} from "../../../components/LoadingSpinner";
import {Fragment, useCallback, useMemo, useState} from "react";
import {DataTable} from "../../../components/tables/DataTable";
import {IconButton} from "../../../components/inputs/buttons/IconButton";
import {SecondaryButton} from "../../../components/inputs/buttons/SecondaryButton";
import {FullPageModal} from "../../../components/modals/FullPageModal";
import {TitleIcon} from "../../../components/icons/TitleIcon";
import {TextInput} from "../../../components/inputs/TextInput";
import {PrimaryButton} from "../../../components/inputs/buttons/PrimaryButton";
import {DateInput} from "../../../components/inputs/DateInput";
import {useOpenUszoverseny} from "../../../hooks/uszoversenyek/useOpenUszoverseny";
import {BorderCard} from "../../../components/containers/BorderCard";
import {useNyitottVerseny} from "../../../hooks/nyitottVerseny/useNyitottVerseny";
import {useCloseUszoverseny} from "../../../hooks/uszoversenyek/useCloseUszoverseny";
import {Uszoverseny} from "../../../types/model/Uszoverseny";
import {WarningButton} from "../../../components/inputs/buttons/WarningButton";
import {useCreateUszoverseny} from "../../../hooks/uszoversenyek/useCreateUszoverseny";

export function UszoversenyekIndexPage() {
    const [uszoversenyek, uszoversenyekLoading] = useUszoversenyekList();
    const [searchParams, setSearchParams] = useSearchParams();
    const [nyitottVerseny, nyitottVersenyLoading] = useNyitottVerseny();
    const openUszoverseny = useOpenUszoverseny();
    const closeUszoverseny = useCloseUszoverseny();

    const doChangeVersenyNyitottState = useCallback((uszoverseny: Uszoverseny) => {
        if (uszoverseny.nyitott) {
            if (window.confirm("Zárjuk le a versenyt?")) {
                closeUszoverseny()
                    .then(console.log)
                    .catch(console.error);
            }
        } else {
            if (window.confirm("Nyissuk meg a versenyt?")) {
                openUszoverseny(uszoverseny.id)
                    .then(console.log)
                    .catch(console.error);
            }
        }
    }, [closeUszoverseny, openUszoverseny]);

    useSetAdminLayoutTitle("Úszóversenyek");

    return uszoversenyekLoading ? (
        <div className="w-full h-full grid place-content-center">
            <LoadingSpinner/>
        </div>
    ) : (
        <Fragment>
            <div className="w-full flex flex-col gap-2 items-start">
                {nyitottVersenyLoading ? (
                    <LoadingSpinner/>
                ) : !!nyitottVerseny ? (
                    <Fragment>
                        <h3>Nyitott verseny</h3>
                        <BorderCard className="w-full flex flex-col gap-2">
                            <p>
                                <b>{nyitottVerseny.nev}</b> ·&nbsp;
                                {nyitottVerseny.helyszin} ·&nbsp;
                                {nyitottVerseny.datum.toLocaleDateString()}
                            </p>
                            <div className="flex flex-row gap-2 items-start">
                                <WarningButton text="Úszóverseny lezárása" onClick={() => {
                                    doChangeVersenyNyitottState(nyitottVerseny);
                                }}/>
                                <Link to={String(nyitottVerseny.id)} className="w-full">
                                    <SecondaryButton text="Részletek megtekintése"/>
                                </Link>
                            </div>
                        </BorderCard>
                    </Fragment>
                ) : null}
                <h3 className="mt-2">További versenyek:</h3>
                <div className="flex flex-col gap-4 w-full items-start">
                    <DataTable dataList={uszoversenyek} propertyNameOverride={{
                        nev: "név",
                        datum: "dátum",
                        helyszin: "helyszín"
                    }} excludedProperties={["id", "nyitott"]} actionColumn={entry => (
                        <Fragment>
                            <IconButton iconName={entry.nyitott ? "stop" : "play_arrow"}
                                        onClick={() => doChangeVersenyNyitottState(entry)}/>
                            <Link to={String(entry.id)}>
                                <IconButton iconName="edit"/>
                            </Link>
                        </Fragment>
                    )}/>
                    <SecondaryButton text="Úszóverseny létrehozása" onClick={() => {
                        setSearchParams({modal: "create"});
                    }}/>
                </div>
            </div>
            {searchParams.get("modal") === "create" ? <NewUszoversenyModal/> : null}
        </Fragment>
    );
}

function NewUszoversenyModal() {
    const [, setSearchParams] = useSearchParams();
    const createUszoverseny = useCreateUszoverseny();

    const [nev, setNev] = useState("");
    const [helyszin, setHelyszin] = useState("");
    const [datum, setDatum] = useState(Date.now());

    const canCreate = useMemo<boolean>(() => {
        return !!nev && !!helyszin && !!datum;
    }, [nev, helyszin, datum]);

    const doCreate = useCallback(() => {
        if (!!nev && !!helyszin) {
            createUszoverseny({
                nev: nev,
                helyszin: helyszin,
                datum: new Date(datum),
                nyitott: false
            }).then((message) => {
                console.log(message);
                setSearchParams(prevState => {
                    prevState.delete("modal");
                    return prevState;
                });
            }).catch(console.error);
        }
    }, [nev, helyszin, createUszoverseny, datum, setSearchParams]);

    return (
        <FullPageModal className="flex flex-col">
            <div className="flex flex-row items-center justify-start gap-6 p-6
                    min-w-max max-w-sm">
                <TitleIcon name="groups"/>
                <h2>Úszóverseny hozzáadása</h2>
            </div>
            <div className="w-full border border-slate-100"></div>
            <div className="flex flex-col gap-2 p-6">
                <TextInput value={nev} onValue={setNev} placeholder="Név"/>
                <TextInput value={helyszin} onValue={setHelyszin} placeholder="Város"/>
                <DateInput value={datum} onValue={setDatum} min={Date.now()}/>
            </div>
            <div className="flex flex-row gap-2 p-6">
                <SecondaryButton text="Inkább nem" onClick={() => {
                    setSearchParams(prevState => {
                        prevState.delete("modal");
                        return prevState;
                    });
                }}/>
                <PrimaryButton text="Mehet!" onClick={doCreate}
                               disabled={!canCreate}/>
            </div>
        </FullPageModal>
    );
}

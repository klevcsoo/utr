import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {useSetAdminLayoutTitle} from "../../../../hooks/useSetAdminLayoutTitle";
import {useVersenyszamDetails} from "../../../../hooks/versenyszamok/useVersenyszamDetails";
import {useUszoversenyDetails} from "../../../../hooks/uszoversenyek/useUszoversenyDetails";
import {LoadingSpinner} from "../../../../components/LoadingSpinner";
import {PrimaryButton} from "../../../../components/inputs/buttons/PrimaryButton";
import {BorderCard} from "../../../../components/containers/BorderCard";
import {useDeleteVersenyszam} from "../../../../hooks/versenyszamok/useDeleteVersenyszam";
import {WarningButton} from "../../../../components/inputs/buttons/WarningButton";
import {Versenyszam} from "../../../../types/model/Versenyszam";
import {EmberiNem} from "../../../../types/EmberiNem";
import {UszasnemElnevezes} from "../../../../types/UszasnemElnevezes";
import {NumberInput} from "../../../../components/inputs/numeric/NumberInput";
import {CheckBox} from "../../../../components/inputs/CheckBox";
import {
    VersenyszamNemDropdown
} from "../../../../components/inputs/dropdowns/VersenyszamNemDropdown";
import {UszasnemDropdown} from "../../../../components/inputs/dropdowns/UszasnemDropdown";
import {SecondaryButton} from "../../../../components/inputs/buttons/SecondaryButton";
import {useEditVersenyszam} from "../../../../hooks/versenyszamok/useEditVersenyszam";
import {useNevezesekList} from "../../../../hooks/nevezesek/useNevezesekList";
import {useDeleteNevezes} from "../../../../hooks/nevezesek/useDeleteNevezes";
import {DataTable} from "../../../../components/tables/DataTable";
import {DisplayedNevezes} from "../../../../types/DisplayedNevezes";
import {formatInterval} from "../../../../utils";
import {IconWarningButton} from "../../../../components/inputs/buttons/IconWarningButton";
import {FullPageModal} from "../../../../components/modals/FullPageModal";
import {CsapatDropdown} from "../../../../components/inputs/dropdowns/CsapatDropdown";
import {TitleIcon} from "../../../../components/icons/TitleIcon";
import {useCreateNevezes} from "../../../../hooks/nevezesek/useCreateNevezes";
import {UszoDropdown} from "../../../../components/inputs/dropdowns/UszoDropdown";
import {IntervalMaskedInput} from "../../../../components/inputs/numeric/IntervalMaskedInput";

export function UszoversenyVersenyszamokSlugPage() {
    const navigate = useNavigate();
    const {id} = useParams();
    const idNumber = useMemo(() => parseInt(id ?? "-1"), [id]);

    const [searchParams] = useSearchParams();

    const [versenyszam, loadingVersenyszam] = useVersenyszamDetails(idNumber);
    const [uszoverseny, loadingUszoverseny] = useUszoversenyDetails(
        versenyszam?.versenyId ?? -1
    );
    const deleteVersenyszam = useDeleteVersenyszam();

    const elnevezes = useMemo(() => {
        if (!versenyszam) {
            return "Betöltés...";
        }

        const valto = versenyszam.valto ? `${versenyszam.valto}x` : "";
        const nem = versenyszam.nem === "F" ? "fiú" : "leány";
        const uszasnem = versenyszam.uszasnem.elnevezes;
        return `${valto}${versenyszam.hossz} ${nem} ${uszasnem}`;
    }, [versenyszam]);

    const doDeleteVersenyszam = useCallback(() => {
        if (!!versenyszam && window.confirm("Biztos, hogy töröljük?")) {
            deleteVersenyszam(versenyszam.id).then(message => {
                console.log(message);
                navigate("..");
            }).catch(console.error);
        }
    }, [deleteVersenyszam, navigate, versenyszam]);

    useSetAdminLayoutTitle(elnevezes);

    return loadingVersenyszam || loadingUszoverseny ? (
        <div className="w-full h-full grid place-content-center">
            <LoadingSpinner/>
        </div>
    ) : !versenyszam || !uszoverseny ? (
        <div className="h-full grid place-content-center">
            <div className="flex flex-col gap-2 items-center">
                <p>Versenyszám nem található</p>
                <Link to=".." relative="path">
                    <PrimaryButton text="Vissza"/>
                </Link>
            </div>
        </div>
    ) : (
        <Fragment>
            <div className="w-full flex flex-col gap-8">
                <h2>{uszoverseny.nev}</h2>
                <div className="flex flex-col gap-2">
                    <h3 className="ml-2">Általános információ:</h3>
                    <VersenyszamDetails versenyszam={versenyszam}/>
                    <WarningButton text="Versenyszám törlése"
                                   onClick={doDeleteVersenyszam}/>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="ml-2 col-span-2">Nevezések:</h3>
                    <NevezesekList versenyszam={versenyszam}/>
                </div>
            </div>
            {searchParams.get("modal") === "nevezes" ? (
                <NevezesModal versenyszam={versenyszam}/>
            ) : null}
        </Fragment>
    );
}

export function VersenyszamDetails(props: {
    versenyszam: Versenyszam
}) {
    const [valtoEnabled, setValtoEnabled] = useState(!!props.versenyszam.valto);
    const [valto, setValto] = useState<number>(props.versenyszam.valto ?? 4);
    const [hossz, setHossz] = useState<number>(props.versenyszam.hossz);
    const [nem, setNem] = useState<EmberiNem>(props.versenyszam.nem);
    const [uszasnem, setUszasnem] = useState<UszasnemElnevezes>(
        props.versenyszam.uszasnem.elnevezes
    );

    const unsavedChanges = useMemo(() => {
        return (
            props.versenyszam.valto !== valto ||
            props.versenyszam.hossz !== hossz ||
            props.versenyszam.nem !== nem ||
            props.versenyszam.uszasnem.elnevezes !== uszasnem
        );
    }, [hossz, nem, props.versenyszam, uszasnem, valto]);

    const uszasnemId = useMemo<number>(() => {
        return [
            "-", "gyorsúszás", "mellúszás", "hátúszás", "pillangóúszás"
        ].indexOf(uszasnem);
    }, [uszasnem]);

    const editVersenyszam = useEditVersenyszam();

    const doCommitChanges = useCallback(() => {
        editVersenyszam(props.versenyszam.id, {
            valto: valtoEnabled ? valto : undefined,
            emberiNemId: nem,
            hossz: hossz,
            uszasnemId: uszasnemId
        }).then(console.log).catch(console.error);
    }, [editVersenyszam, hossz, nem, props.versenyszam.id, uszasnemId, valto, valtoEnabled]);

    return (
        <BorderCard className="grid grid-cols-2 gap-2">
            <p>Váltó: </p>
            <div className="flex flex-row gap-2 justify-items-start">
                <CheckBox value={valtoEnabled} onValue={setValtoEnabled}/>
                <NumberInput value={valto} onValue={setValto}
                             disabled={!valtoEnabled}/>
            </div>
            <p>Hossz: </p>
            <NumberInput value={hossz} onValue={setHossz}/>
            <p>Nem: </p>
            <VersenyszamNemDropdown selected={nem} onSelect={setNem}/>
            <p>Úszásnem: </p>
            <UszasnemDropdown selected={uszasnem} onSelect={setUszasnem}/>
            {unsavedChanges ? (
                <SecondaryButton text="Módosítások mentése" onClick={doCommitChanges}/>
            ) : null}
        </BorderCard>
    );
}

export function NevezesekList(props: {
    versenyszam: Versenyszam
}) {
    const [nevezesek, loadingNevezesek] = useNevezesekList(props.versenyszam.id);
    const deleteNevezes = useDeleteNevezes();
    const [, setSearchParams] = useSearchParams();

    const displayedNevezesek = useMemo<Omit<DisplayedNevezes, "megjelent">[]>(() => {
        return nevezesek.map(value => {
            return {
                id: value.id,
                uszoNev: value.uszo.nev,
                uszoSzuletesiEv: value.uszo.szuletesiDatum,
                csapatNev: value.uszo.csapat.nev,
                nevezesiIdo: value.nevezesiIdo ? formatInterval(value.nevezesiIdo) : "nincs",
                idoeredmeny: value.idoeredmeny ? formatInterval(value.idoeredmeny) : "nincs"
            };
        });
    }, [nevezesek]);

    const doDeleteNevezes = useCallback((id: number) => {
        deleteNevezes(id).then(console.log).catch(console.error);
    }, [deleteNevezes]);

    const doOpenNewNevezesModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.set("modal", "nevezes");
            return prevState;
        });
    }, [setSearchParams]);

    return loadingNevezesek ? (
        <div className="grid place-content-center">
            <LoadingSpinner/>
        </div>
    ) : !nevezesek || !nevezesek.length ? (
        <BorderCard>
            <p>
                Jelenleg egy úszó sincs benevezve a versenyszámba.
                Adjunk hozzá egyet?
            </p>
        </BorderCard>
    ) : (
        <Fragment>
            <DataTable dataList={displayedNevezesek} propertyNameOverride={{
                uszoNev: "úszó",
                uszoSzuletesiEv: "születési év",
                csapatNev: "csapat",
                nevezesiIdo: "nevezési idő",
                idoeredmeny: "időeredmény"
            }} excludedProperties={["id"]} actionColumn={({id}) => (
                <Fragment>
                    <IconWarningButton iconName="delete"
                                       onClick={() => doDeleteNevezes(id)}/>
                </Fragment>
            )}/>
            <SecondaryButton text="Úszó benevezése" onClick={doOpenNewNevezesModal}/>
        </Fragment>
    );
}

function NevezesModal(props: {
    versenyszam: Versenyszam
}) {
    const [, setSearchParams] = useSearchParams();
    const createNevezes = useCreateNevezes();

    const [csapat, setCsapat] = useState<number>(NaN);
    const [uszo, setUszo] = useState<number>(NaN);
    const [nevezesiIdo, setNevezesiIdo] = useState<string>();
    const [nevezesiIdoEnabled, setNevezesiIdoEnabled] = useState(false);

    const canAdd = useMemo(() => {
        return !!uszo &&
            (nevezesiIdoEnabled ?
                (!!nevezesiIdo && !nevezesiIdo.includes("_")) :
                true);
    }, [nevezesiIdo, nevezesiIdoEnabled, uszo]);

    const doCloseModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.delete("modal");
            prevState.delete("versenyszamId");
            return prevState;
        });
    }, [setSearchParams]);

    const doAddNevezes = useCallback(() => {
        if (!canAdd) {
            return;
        }

        createNevezes({
            megjelent: true,
            nevezesiIdo: nevezesiIdo,
            versenyszamId: props.versenyszam.id,
            uszoId: uszo
        }).then(message => {
            console.log(message);
            doCloseModal();
        }).catch(console.error);
    }, [canAdd, createNevezes, doCloseModal, nevezesiIdo, props.versenyszam, uszo]);

    useEffect(() => {
        setUszo(NaN);
    }, [csapat]);

    return (
        <FullPageModal className="flex flex-col">
            <div className="flex flex-row items-center
                    justify-start gap-6 p-6 min-w-max max-w-sm">
                <TitleIcon name="person"/>
                <h2>Úszó benevezése</h2>
            </div>
            <div className="w-full border border-slate-100"></div>
            <div className="grid grid-rows-[auto_auto] grid-cols-[auto_auto]
                        gap-y-2 gap-x-8 items-center p-6">
                <label>Csapat:</label>
                <CsapatDropdown selected={csapat} onSelect={setCsapat}/>
                {csapat ? (
                    <Fragment>
                        <label>Úszó:</label>
                        <UszoDropdown csapatId={csapat} selected={uszo}
                                      onSelect={setUszo}/>
                    </Fragment>
                ) : null}
                {uszo ? (
                    <Fragment>
                        <label>Nevezési idő:</label>
                        <div className="flex flex-row gap-2 justify-items-start">
                            <CheckBox value={nevezesiIdoEnabled}
                                      onValue={setNevezesiIdoEnabled}/>
                            <IntervalMaskedInput value={nevezesiIdo}
                                                 onValue={setNevezesiIdo}
                                                 disabled={!nevezesiIdoEnabled}/>
                        </div>
                    </Fragment>
                ) : null}
            </div>
            <div className="flex flex-row gap-2 p-6">
                <SecondaryButton text="Inkább nem" onClick={doCloseModal}/>
                <PrimaryButton text="Mehet!" onClick={doAddNevezes}
                               disabled={!canAdd}/>
            </div>
        </FullPageModal>
    );
}

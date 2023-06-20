import {Link, useNavigate, useParams} from "react-router-dom";
import {Fragment, useCallback, useMemo, useState} from "react";
import {useSetAdminLayoutTitle} from "../../../../hooks/useSetAdminLayoutTitle";
import {useVersenyszamDetails} from "../../../../hooks/versenyszamok/useVersenyszamDetails";
import {useUszoversenyDetails} from "../../../../hooks/uszoversenyek/useUszoversenyDetails";
import {LoadingSpinner} from "../../../../components/LoadingSpinner";
import {PrimaryButton} from "../../../../components/inputs/PrimaryButton";
import {BorderCard} from "../../../../components/containers/BorderCard";
import {useDeleteVersenyszam} from "../../../../hooks/versenyszamok/useDeleteVersenyszam";
import {WarningButton} from "../../../../components/inputs/WarningButton";
import {Versenyszam} from "../../../../types/model/Versenyszam";
import {EmberiNem} from "../../../../types/EmberiNem";
import {UszasnemElnevezes} from "../../../../types/UszasnemElnevezes";
import {NumberInput} from "../../../../components/inputs/NumberInput";
import {CheckBox} from "../../../../components/inputs/CheckBox";
import {
    VersenyszamNemDropdown
} from "../../../../components/inputs/dropdowns/VersenyszamNemDropdown";
import {UszasnemDropdown} from "../../../../components/inputs/dropdowns/UszasnemDropdown";
import {SecondaryButton} from "../../../../components/inputs/SecondaryButton";
import {useEditVersenyszam} from "../../../../hooks/versenyszamok/useEditVersenyszam";

export function UszoversenyVersenyszamokSlugPage() {
    const navigate = useNavigate();
    const {id} = useParams();
    const idNumber = useMemo(() => parseInt(id ?? "-1"), [id]);

    const [versenyszam, loadingVersenyszam] = useVersenyszamDetails(idNumber);
    const [uszoverseny, loadingUszoverseny] = useUszoversenyDetails(
        versenyszam?.id ?? -1
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
                </div>
            </div>
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
            <VersenyszamNemDropdown selected={nem} onSelected={setNem}/>
            <p>Úszásnem: </p>
            <UszasnemDropdown selected={uszasnem} onSelected={setUszasnem}/>
            {unsavedChanges ? (
                <SecondaryButton text="Módosítások mentése" onClick={doCommitChanges}/>
            ) : null}
        </BorderCard>
    );
}

import {Link, useParams, useSearchParams} from "react-router-dom";
import {Fragment, useMemo} from "react";
import {useSetAdminLayoutTitle} from "../../../../hooks/useSetAdminLayoutTitle";
import {useVersenyszamDetails} from "../../../../hooks/versenyszamok/useVersenyszamDetails";
import {useUszoversenyDetails} from "../../../../hooks/uszoversenyek/useUszoversenyDetails";
import {LoadingSpinner} from "../../../../components/LoadingSpinner";
import {PrimaryButton} from "../../../../components/inputs/PrimaryButton";
import {BorderCard} from "../../../../components/containers/BorderCard";

export function UszoversenyVersenyszamokSlugPage() {
    const {id} = useParams();
    const idNumber = useMemo(() => parseInt(id ?? "-1"), [id]);

    const [searchParams, setSearchParams] = useSearchParams();

    const [versenyszam, loadingVersenyszam] = useVersenyszamDetails(idNumber);
    const [uszoverseny, loadingUszoverseny] = useUszoversenyDetails(
        versenyszam?.id ?? -1
    );

    const elnevezes = useMemo(() => {
        if (!versenyszam) {
            return "Betöltés...";
        }

        const valto = versenyszam.valto ? `${versenyszam.valto}x` : "";
        const nem = versenyszam.nem === "F" ? "fiú" : "leány";
        const uszasnem = versenyszam.uszasnem.elnevezes;
        return `${valto}${versenyszam.hossz} ${nem} ${uszasnem}`;
    }, [versenyszam]);

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
                    <BorderCard className="grid grid-cols-2">
                        <p>Váltó: </p>
                        <p><b>{!versenyszam.valto ? "nincs" : `${versenyszam.valto}x`}</b></p>
                        <p>Hossz: </p>
                        <p><b>{versenyszam.hossz}m</b></p>
                        <p>Nem: </p>
                        <p><b>{versenyszam.nem === "F" ? "fiú" : "leány"}</b></p>
                        <p>Úszásnem: </p>
                        <p><b>{versenyszam.uszasnem.elnevezes}</b></p>
                    </BorderCard>
                    {/*<div className="flex flex-row gap-2">*/}
                    {/*    <PrimaryButton text="Úszóverseny adatainak szerkesztése"*/}
                    {/*                   onClick={doOpenEditUszoversenyModal}/>*/}
                    {/*    {uszoverseny.nyitott ? (*/}
                    {/*        <WarningButton text="Úszóverseny lezárása"*/}
                    {/*                       onClick={doCloseUszoverseny}/>*/}
                    {/*    ) : (*/}
                    {/*        <SecondaryButton text="Úszóverseny megnyitása"*/}
                    {/*                         onClick={doOpenUszoverseny}/>*/}
                    {/*    )}*/}
                    {/*    <WarningButton text="Úszóverseny törlése"*/}
                    {/*                   onClick={doDeleteUszoverseny}/>*/}
                    {/*</div>*/}
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="ml-2 col-span-2">Nevezések:</h3>
                </div>
            </div>
        </Fragment>
    );
}

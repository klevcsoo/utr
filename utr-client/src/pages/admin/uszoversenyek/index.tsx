import {useUszoversenyekList} from "../../../hooks/uszoversenyek/useUszoversenyekList";
import {Link, useSearchParams} from "react-router-dom";
import {useSetAdminLayoutTitle} from "../../../hooks/useSetAdminLayoutTitle";
import {LoadingSpinner} from "../../../components/LoadingSpinner";
import {Fragment, useCallback, useMemo, useState} from "react";
import {DataTable} from "../../../components/tables/DataTable";
import {IconButton} from "../../../components/inputs/IconButton";
import {SecondaryButton} from "../../../components/inputs/SecondaryButton";
import {useAuthUser} from "../../../hooks/auth/useAuthUser";
import {FullPageModal} from "../../../components/modals/FullPageModal";
import {TitleIcon} from "../../../components/icons/TitleIcon";
import {TextInput} from "../../../components/inputs/TextInput";
import {PrimaryButton} from "../../../components/inputs/PrimaryButton";
import {createUszoverseny} from "../../../api/versenyek";

export function UszoversenyekIndexPage() {
    const [uszoversenyek, uszoversenyekLoading] = useUszoversenyekList();
    const [searchParams, setSearchParams] = useSearchParams();

    useSetAdminLayoutTitle("Úszóversenyek");

    return uszoversenyekLoading ? (
        <div className="w-full h-full grid place-content-center">
            <LoadingSpinner/>
        </div>
    ) : (
        <Fragment>
            <div className="w-full flex flex-col gap-4 items-start">
                <DataTable dataList={uszoversenyek} propertyNameOverride={{
                    nev: "név",
                    datum: "dátum",
                    helyszin: "helyszín"
                }} excludedProperties={["id", "nyitott"]} actionColumn={entry => (
                    <Link to={String(entry.id)}>
                        <IconButton iconName="edit"/>
                    </Link>
                )}/>
                <SecondaryButton text="Úszóverseny létrehozása" onClick={() => {
                    setSearchParams({modal: "newCsapat"});
                }}/>
            </div>
            {searchParams.get("modal") === "create" ? <NewUszoversenyModal/> : null}
        </Fragment>
    );
}

function NewUszoversenyModal() {
    const user = useAuthUser();
    const [, setSearchParams] = useSearchParams();

    const [nev, setNev] = useState("");
    const [helyszin, setHelyszin] = useState("");
    const [datum, setDatum] = useState(0);

    const canCreate = useMemo<boolean>(() => {
        return !!nev && !!helyszin && !!datum;
    }, [nev, helyszin, datum]);

    const doCreate = useCallback(() => {
        if (!!user && !!nev && !!helyszin) {
            createUszoverseny(user, {
                nev: nev,
                helyszin: helyszin,
                datum: new Date(datum),
                nyitott: false
            }).then(({message}) => {
                console.log(message);
                setSearchParams(prevState => {
                    prevState.delete("modal");
                    return prevState;
                });
            }).catch(console.error);
        }
    }, [user, nev, helyszin, datum, setSearchParams]);

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

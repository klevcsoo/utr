import {useCsapatokList} from "../../../hooks/csapatok/useCsapatokList";
import {DataTable} from "../../../components/tables/DataTable";
import {LoadingSpinner} from "../../../components/LoadingSpinner";
import {Link, useSearchParams} from "react-router-dom";
import {PrimaryButton} from "../../../components/inputs/buttons/PrimaryButton";
import {Fragment, useCallback, useMemo, useState} from "react";
import {FullPageModal} from "../../../components/modals/FullPageModal";
import {TitleIcon} from "../../../components/icons/TitleIcon";
import {SecondaryButton} from "../../../components/inputs/buttons/SecondaryButton";
import {TextInput} from "../../../components/inputs/TextInput";
import {useAuthUser} from "../../../hooks/auth/useAuthUser";
import {createCsapat} from "../../../api/csapatok";
import {useSetAdminLayoutTitle} from "../../../hooks/useSetAdminLayoutTitle";
import {IconButton} from "../../../components/inputs/buttons/IconButton";

export function CsapatokIndexPage() {
    const [csapatok, csapatokLoading] = useCsapatokList();
    const [searchParams, setSearchParams] = useSearchParams();

    useSetAdminLayoutTitle("Csapatok");

    return csapatokLoading ? (
        <div className="w-full h-full grid place-content-center">
            <LoadingSpinner/>
        </div>
    ) : (
        <Fragment>
            <div className="w-full flex flex-col gap-4 items-start">
                <DataTable dataList={csapatok} propertyNameOverride={{
                    nev: "név",
                    varos: "város",
                    id: "azonosító"
                }} excludedProperties={["id"]} actionColumn={entry => (
                    <Link to={String(entry.id)}>
                        <IconButton iconName="edit"/>
                    </Link>
                )}/>
                <SecondaryButton text="Csapat hozzáadása" onClick={() => {
                    setSearchParams({modal: "newCsapat"});
                }}/>
            </div>
            {searchParams.get("modal") === "newCsapat" ? <NewCsapatPopup/> : null}
        </Fragment>
    );
}

function NewCsapatPopup() {
    const user = useAuthUser();
    const [, setSearchParams] = useSearchParams();

    const [nev, setNev] = useState("");
    const [varos, setVaros] = useState("");

    const canCreate = useMemo<boolean>(() => {
        return !!nev && !!varos;
    }, [nev, varos]);

    const doCreate = useCallback(() => {
        if (!!user && !!nev && !!varos) {
            createCsapat(user, {nev: nev, varos: varos}).then(({message}) => {
                console.log(message);
                setSearchParams(prevState => {
                    prevState.delete("modal");
                    return prevState;
                });
            }).catch(console.error);
        }
    }, [user, nev, varos, setSearchParams]);

    return (
        <FullPageModal className="flex flex-col">
            <div className="flex flex-row items-center justify-start gap-6 p-6
                    min-w-max max-w-sm">
                <TitleIcon name="groups"/>
                <h2>Csapat hozzáadása</h2>
            </div>
            <div className="w-full border border-slate-100"></div>
            <div className="flex flex-col gap-2 p-6">
                <TextInput value={nev} onValue={setNev} placeholder="Név"/>
                <TextInput value={varos} onValue={setVaros} placeholder="Város"/>
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

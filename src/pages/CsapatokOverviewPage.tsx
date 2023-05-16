import {useCsapatokList} from "../hooks/useCsapatokList";
import {DataTable} from "../components/tables/DataTable";
import {LoadingSpinner} from "../components/LoadingSpinner";
import {Link, useNavigate} from "react-router-dom";
import {PrimaryButton} from "../components/inputs/PrimaryButton";
import {Fragment, useCallback, useMemo, useState} from "react";
import {FullPagePopup} from "../components/popups/FullPagePopup";
import {TitleIcon} from "../components/icons/TitleIcon";
import {SecondaryButton} from "../components/inputs/SecondaryButton";
import {TextInput} from "../components/inputs/TextInput";
import {useAuthUser} from "../hooks/useAuthUser";
import {createCsapat} from "../api/csapatok";
import {useSetAdminLayoutTitle} from "../hooks/useSetAdminLayoutTitle";
import {IconButton} from "../components/inputs/IconButton";

export function CsapatokOverviewPage(props: {
    newPopup?: boolean
}) {
    const [csapatok, csapatokLoading] = useCsapatokList();

    useSetAdminLayoutTitle("Csapatok");

    return csapatokLoading ? (
        <div className="grid place-content-center h-screen">
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
                    <Link to={`/overview/csapatok/${entry.id}`}>
                        <IconButton iconName="edit"/>
                    </Link>
                )}/>
                <Link to="new">
                    <SecondaryButton text="Csapat hozzáadása"/>
                </Link>
            </div>
            {!props.newPopup ? null : <NewCsapatPopup/>}
        </Fragment>
    );
}

function NewCsapatPopup() {
    const {user} = useAuthUser();
    const navigate = useNavigate();

    const [nev, setNev] = useState("");
    const [varos, setVaros] = useState("");

    const canCreate = useMemo<boolean>(() => {
        return !!nev && !!varos;
    }, [nev, varos]);

    const doCreate = useCallback(() => {
        if (!!user && !!nev && !!varos) {
            createCsapat(user, {nev: nev, varos: varos}).then(({message}) => {
                console.log(message);
                navigate("/overview/csapatok");
            }).catch(console.error);
        }
    }, [nev, varos, user, navigate]);

    return (
        <FullPagePopup className="flex flex-col">
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
                <Link to="/overview/csapatok" className="w-full">
                    <SecondaryButton text="Inkább nem"/>
                </Link>
                <PrimaryButton text="Mehet!" onClick={doCreate}
                               disabled={!canCreate}/>
            </div>
        </FullPagePopup>
    );
}

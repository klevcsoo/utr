import {useCsapatokList} from "../hooks/csapatok/useCsapatokList";
import {DataTable} from "../components/tables/DataTable";
import {LoadingSpinner} from "../components/LoadingSpinner";
import {Link, useSearchParams} from "react-router-dom";
import {Fragment, useCallback, useMemo, useState} from "react";
import {SecondaryButton} from "../components/inputs/buttons/SecondaryButton";
import {TextInput} from "../components/inputs/TextInput";
import {useAuthUser} from "../hooks/auth/useAuthUser";
import {createCsapat} from "../api/csapatok";
import {useSetAdminLayoutTitle} from "../hooks/useSetAdminLayoutTitle";
import {IconButton} from "../components/inputs/buttons/IconButton";
import {useTranslation} from "../hooks/translations/useTranslation";
import {FullPageModalWithActions} from "../components/modals/FullPageModalWithActions";

export function CsapatokIndexPage() {
    const [csapatok, csapatokLoading] = useCsapatokList();
    const [searchParams, setSearchParams] = useSearchParams();
    const t = useTranslation();

    useSetAdminLayoutTitle(t("title.admin_layout.csapatok"));

    return csapatokLoading ? (
        <div className="w-full h-full grid place-content-center">
            <LoadingSpinner/>
        </div>
    ) : (
        <Fragment>
            <div className="w-full flex flex-col gap-4 items-start">
                <DataTable dataList={csapatok} propertyNameOverride={{
                    nev: t("generic_label.name"),
                    varos: t("generic_label.city"),
                    id: t("generic_label.id")
                }} excludedProperties={["id"]} actionColumn={entry => (
                    <Link to={String(entry.id)}>
                        <IconButton iconName="edit"/>
                    </Link>
                )}/>
                <SecondaryButton text={t("actions.csapat.create")} onClick={() => {
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
    const t = useTranslation();

    const [nev, setNev] = useState("");
    const [varos, setVaros] = useState("");

    const canComplete = useMemo<boolean>(() => {
        return !!nev && !!varos;
    }, [nev, varos]);

    const doComplete = useCallback(() => {
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

    const doDismiss = useCallback(() => {
        setSearchParams(prevState => {
            prevState.delete("modal");
            return prevState;
        });
    }, [setSearchParams]);

    return (
        <FullPageModalWithActions icon="groups"
                                  title={t("actions.csapat.create")}
                                  onComplete={doComplete} onDismiss={doDismiss}
                                  canComplete={canComplete}
                                  className="flex flex-col gap-2 p-6">
            <TextInput value={nev} onValue={setNev}
                       placeholder={t("generic_label.name")}/>
            <TextInput value={varos} onValue={setVaros}
                       placeholder={t("generic_label.city")}/>
        </FullPageModalWithActions>
    );
}

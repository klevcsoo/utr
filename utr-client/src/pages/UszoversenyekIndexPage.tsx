import {useUszoversenyekList} from "../hooks/uszoversenyek/useUszoversenyekList";
import {Link, useSearchParams} from "react-router-dom";
import {useSetAdminLayoutTitle} from "../hooks/useSetAdminLayoutTitle";
import {Fragment, useCallback, useMemo, useState} from "react";
import {DataTable} from "../components/tables/DataTable";
import {TextInput} from "../components/inputs/TextInput";
import {DateInput} from "../components/inputs/DateInput";
import {useOpenUszoverseny} from "../hooks/uszoversenyek/useOpenUszoverseny";
import {BorderCard} from "../components/containers/BorderCard";
import {useNyitottVerseny} from "../hooks/nyitottVerseny/useNyitottVerseny";
import {useCloseUszoverseny} from "../hooks/uszoversenyek/useCloseUszoverseny";
import {Uszoverseny} from "../types/model/Uszoverseny";
import {useCreateUszoverseny} from "../hooks/uszoversenyek/useCreateUszoverseny";
import {useTranslation} from "../hooks/translations/useTranslation";
import {FullPageModalWithActions} from "../components/modals/FullPageModalWithActions";
import {DestructiveButton} from "../components/buttons";
import {Button, IconButton, Spinner} from "@material-tailwind/react";
import {LockClosedIcon, LockOpenIcon, PencilIcon} from "@heroicons/react/24/solid";

export function UszoversenyekIndexPage() {
    const t = useTranslation();

    const [uszoversenyek, uszoversenyekLoading] = useUszoversenyekList();
    const [searchParams, setSearchParams] = useSearchParams();
    const [nyitottVerseny, nyitottVersenyLoading] = useNyitottVerseny();
    const openUszoverseny = useOpenUszoverseny();
    const closeUszoverseny = useCloseUszoverseny();

    const doChangeVersenyNyitottState = useCallback((uszoverseny: Uszoverseny) => {
        if (uszoverseny.nyitott) {
            if (window.confirm(t("confirm.uszoverseny.close"))) {
                closeUszoverseny()
                    .then(console.log)
                    .catch(console.error);
            }
        } else {
            if (window.confirm(t("confirm.uszoverseny.open"))) {
                openUszoverseny(uszoverseny.id)
                    .then(console.log)
                    .catch(console.error);
            }
        }
    }, [closeUszoverseny, openUszoverseny, t]);

    useSetAdminLayoutTitle(t("title.admin_layout.uszoversenyek"));

    return uszoversenyekLoading ? (
        <div className="w-full h-full grid place-content-center">
            <Spinner/>
        </div>
    ) : (
        <Fragment>
            <div className="w-full flex flex-col gap-2 items-start">
                {nyitottVersenyLoading ? (
                    <Spinner/>
                ) : !!nyitottVerseny ? (
                    <Fragment>
                        <h3>{t("uszoverseny.opened")}</h3>
                        <BorderCard className="w-full flex flex-col gap-2">
                            <p>
                                <b>{nyitottVerseny.nev}</b> ·&nbsp;
                                {nyitottVerseny.helyszin} ·&nbsp;
                                {nyitottVerseny.datum.toLocaleDateString()}
                            </p>
                            <div className="flex flex-row gap-2 items-start">
                                <DestructiveButton
                                    confirmText={t("actions.uszoverseny.close")}
                                    onClick={() => {
                                        doChangeVersenyNyitottState(nyitottVerseny);
                                    }}>
                                    {t("actions.uszoverseny.close")}
                                </DestructiveButton>
                                <Link to={String(nyitottVerseny.id)} className="w-full">
                                    <Button variant="outlined">
                                        {t("actions.generic.view_details")}
                                    </Button>
                                </Link>
                            </div>
                        </BorderCard>
                    </Fragment>
                ) : null}
                <h3 className="mt-2">{t("uszoversenyek.other_versenyek")}</h3>
                <div className="flex flex-col gap-4 w-full items-start">
                    <DataTable dataList={uszoversenyek} propertyNameOverride={{
                        nev: t("generic_label.name"),
                        datum: t("generic_label.date"),
                        helyszin: t("generic_label.location")
                    }} excludedProperties={["id", "nyitott"]} actionColumn={entry => (
                        <Fragment>
                            <IconButton className="w-5"
                                        onClick={() => doChangeVersenyNyitottState(entry)}>
                                {entry.nyitott ? <LockClosedIcon/> : <LockOpenIcon/>}
                            </IconButton>
                            <Link to={String(entry.id)}>
                                <IconButton className="w-5">
                                    <PencilIcon/>
                                </IconButton>
                            </Link>
                        </Fragment>
                    )}/>
                    <Button variant="outlined" onClick={() => {
                        setSearchParams({modal: "create"});
                    }}>
                        {t("actions.uszoverseny.create")}
                    </Button>
                </div>
            </div>
            {searchParams.get("modal") === "create" ? <NewUszoversenyModal/> : null}
        </Fragment>
    );
}

function NewUszoversenyModal() {
    const t = useTranslation();
    const [, setSearchParams] = useSearchParams();
    const createUszoverseny = useCreateUszoverseny();

    const [nev, setNev] = useState("");
    const [helyszin, setHelyszin] = useState("");
    const [datum, setDatum] = useState(Date.now());

    const canComplete = useMemo<boolean>(() => {
        return !!nev && !!helyszin && !!datum;
    }, [nev, helyszin, datum]);

    const doComplete = useCallback(() => {
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

    const doDismiss = useCallback(() => {
        setSearchParams(prevState => {
            prevState.delete("modal");
            return prevState;
        });
    }, [setSearchParams]);

    return (
        <FullPageModalWithActions icon="groups"
                                  title={t("actions.uszoverseny.create")}
                                  onComplete={doComplete} onDismiss={doDismiss}
                                  className="flex flex-col gap-2 p-6"
                                  canComplete={canComplete}>
            <TextInput value={nev} onValue={setNev}
                       placeholder={t("generic_label.name")}/>
            <TextInput value={helyszin} onValue={setHelyszin}
                       placeholder={t("generic_label.city")}/>
            <DateInput value={datum} onValue={setDatum} min={Date.now()}/>
        </FullPageModalWithActions>
    );
}

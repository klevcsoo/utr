import {useUszoversenyekList} from "../hooks/uszoversenyek/useUszoversenyekList";
import {Link, useSearchParams} from "react-router-dom";
import {useSetAdminLayoutTitle} from "../hooks/useSetAdminLayoutTitle";
import {LoadingSpinner} from "../components/LoadingSpinner";
import {Fragment, useCallback, useMemo, useState} from "react";
import {DataTable} from "../components/tables/DataTable";
import {IconButton} from "../components/inputs/buttons/IconButton";
import {SecondaryButton} from "../components/inputs/buttons/SecondaryButton";
import {FullPageModal} from "../components/modals/FullPageModal";
import {TitleIcon} from "../components/icons/TitleIcon";
import {TextInput} from "../components/inputs/TextInput";
import {PrimaryButton} from "../components/inputs/buttons/PrimaryButton";
import {DateInput} from "../components/inputs/DateInput";
import {useOpenUszoverseny} from "../hooks/uszoversenyek/useOpenUszoverseny";
import {BorderCard} from "../components/containers/BorderCard";
import {useNyitottVerseny} from "../hooks/nyitottVerseny/useNyitottVerseny";
import {useCloseUszoverseny} from "../hooks/uszoversenyek/useCloseUszoverseny";
import {Uszoverseny} from "../types/model/Uszoverseny";
import {WarningButton} from "../components/inputs/buttons/WarningButton";
import {useCreateUszoverseny} from "../hooks/uszoversenyek/useCreateUszoverseny";
import {useTranslation} from "../hooks/translations/useTranslation";

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
            <LoadingSpinner/>
        </div>
    ) : (
        <Fragment>
            <div className="w-full flex flex-col gap-2 items-start">
                {nyitottVersenyLoading ? (
                    <LoadingSpinner/>
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
                                <WarningButton text={t("actions.uszoverseny.close")}
                                               onClick={() => {
                                                   doChangeVersenyNyitottState(nyitottVerseny);
                                               }}/>
                                <Link to={String(nyitottVerseny.id)} className="w-full">
                                    <SecondaryButton text={t("actions.generic.view_details")}/>
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
                            <IconButton iconName={entry.nyitott ? "stop" : "play_arrow"}
                                        onClick={() => doChangeVersenyNyitottState(entry)}/>
                            <Link to={String(entry.id)}>
                                <IconButton iconName="edit"/>
                            </Link>
                        </Fragment>
                    )}/>
                    <SecondaryButton text={t("actions.uszoverseny.create")} onClick={() => {
                        setSearchParams({modal: "create"});
                    }}/>
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
                <h2>{t("actions.uszoverseny.create")}</h2>
            </div>
            <div className="w-full border border-slate-100"></div>
            <div className="flex flex-col gap-2 p-6">
                <TextInput value={nev} onValue={setNev}
                           placeholder={t("generic_label.name")}/>
                <TextInput value={helyszin} onValue={setHelyszin}
                           placeholder={t("generic_label.city")}/>
                <DateInput value={datum} onValue={setDatum} min={Date.now()}/>
            </div>
            <div className="flex flex-row gap-2 p-6">
                <SecondaryButton text={t("generic_label.rather_not")}
                                 onClick={() => {
                                     setSearchParams(prevState => {
                                         prevState.delete("modal");
                                         return prevState;
                                     });
                                 }}/>
                <PrimaryButton text={t("generic_label.lets_go")} onClick={doCreate}
                               disabled={!canCreate}/>
            </div>
        </FullPageModal>
    );
}

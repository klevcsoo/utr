import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {useSetAdminLayoutTitle} from "../hooks/useSetAdminLayoutTitle";
import {useVersenyszamDetails} from "../hooks/versenyszamok/useVersenyszamDetails";
import {useUszoversenyDetails} from "../hooks/uszoversenyek/useUszoversenyDetails";
import {LoadingSpinner} from "../components/LoadingSpinner";
import {BorderCard} from "../components/containers/BorderCard";
import {useDeleteVersenyszam} from "../hooks/versenyszamok/useDeleteVersenyszam";
import {Versenyszam} from "../types/model/Versenyszam";
import {EmberiNemId} from "../types/EmberiNemId";
import {UszasnemId} from "../types/UszasnemId";
import {NumberInput} from "../components/inputs/numeric/NumberInput";
import {CheckBox} from "../components/inputs/CheckBox";
import {
    CsapatSelect,
    UszasnemSelect,
    UszoSelect,
    VersenyszamNemSelect
} from "../components/selects";
import {useEditVersenyszam} from "../hooks/versenyszamok/useEditVersenyszam";
import {useNevezesekList} from "../hooks/nevezesek/useNevezesekList";
import {useDeleteNevezes} from "../hooks/nevezesek/useDeleteNevezes";
import {DataTable} from "../components/tables/DataTable";
import {DisplayedNevezes} from "../types/DisplayedNevezes";
import {formatInterval} from "../lib/utils";
import {useCreateNevezes} from "../hooks/nevezesek/useCreateNevezes";
import {IntervalMaskedInput} from "../components/inputs/numeric/IntervalMaskedInput";
import {useTranslation} from "../hooks/translations/useTranslation";
import {useGetVersenyszamNemElnevezes} from "../hooks/useGetVersenyszamNemElnevezes";
import {useGetUszasnemElnevezes} from "../hooks/useGetUszasnemElnevezes";
import {FullPageModalWithActions} from "../components/modals/FullPageModalWithActions";
import {Button} from "@material-tailwind/react";
import {DestructiveButton, DestructiveIconButton} from "../components/buttons";

export function VersenyszamokSlugPage() {
    const t = useTranslation();
    const getVersenyszamNemElnevezes = useGetVersenyszamNemElnevezes();
    const getUszasnemElnevezes = useGetUszasnemElnevezes();

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
            return t("generic_label.loading");
        }

        const valto = versenyszam.valto ? `${versenyszam.valto}x` : "";
        const nem = getVersenyszamNemElnevezes(versenyszam.nem);
        const uszasnem = getUszasnemElnevezes(versenyszam.uszasnem);
        return `${valto}${versenyszam.hossz} ${nem} ${uszasnem}`;
    }, [getUszasnemElnevezes, getVersenyszamNemElnevezes, t, versenyszam]);

    const doDeleteVersenyszam = useCallback(() => {
        if (!!versenyszam && window.confirm(t("confirm.generic.delete"))) {
            deleteVersenyszam(versenyszam.id).then(message => {
                console.log(message);
                navigate("..");
            }).catch(console.error);
        }
    }, [deleteVersenyszam, navigate, t, versenyszam]);

    useSetAdminLayoutTitle(elnevezes);

    return loadingVersenyszam || loadingUszoverseny ? (
        <div className="w-full h-full grid place-content-center">
            <LoadingSpinner/>
        </div>
    ) : !versenyszam || !uszoverseny ? (
        <div className="h-full grid place-content-center">
            <div className="flex flex-col gap-2 items-center">
                <p>{t("versenyszam.not_found")}</p>
                <Link to=".." relative="path">
                    <Button>{t("actions.generic.back")}</Button>
                </Link>
            </div>
        </div>
    ) : (
        <Fragment>
            <div className="w-full flex flex-col gap-8">
                <h2>{uszoverseny.nev}</h2>
                <div className="flex flex-col gap-2">
                    <h3 className="ml-2">{t("generic_label.generic_info.with_colon")}</h3>
                    <VersenyszamDetails versenyszam={versenyszam}/>
                    <DestructiveButton confirmText={t("actions.versenyszam.delete")}
                                       onClick={doDeleteVersenyszam}>
                        {t("actions.versenyszam.delete")}
                    </DestructiveButton>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="ml-2 col-span-2">{t("versenyszam.nevezesek")}</h3>
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
    const t = useTranslation();

    const [valtoEnabled, setValtoEnabled] = useState(!!props.versenyszam.valto);
    const [valto, setValto] = useState<number>(props.versenyszam.valto ?? 4);
    const [hossz, setHossz] = useState<number>(props.versenyszam.hossz);
    const [nem, setNem] = useState<EmberiNemId>(props.versenyszam.nem);
    const [uszasnem, setUszasnem] = useState<UszasnemId>(
        props.versenyszam.uszasnem
    );

    const unsavedChanges = useMemo(() => {
        return (
            props.versenyszam.valto !== valto ||
            props.versenyszam.hossz !== hossz ||
            props.versenyszam.nem !== nem ||
            props.versenyszam.uszasnem !== uszasnem
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
            <p>{t("versenyszam.valto")}</p>
            <div className="flex flex-row gap-2 justify-items-start">
                <CheckBox value={valtoEnabled} onValue={setValtoEnabled}/>
                <NumberInput value={valto} onValue={setValto}
                             disabled={!valtoEnabled}/>
            </div>
            <p>{t("versenyszam.hossz")}</p>
            <NumberInput value={hossz} onValue={setHossz}/>
            <p>{t("versenyszam.nem")}</p>
            <VersenyszamNemSelect selected={nem} onSelect={setNem}/>
            <p>{t("versenyszam.uszasnem")}</p>
            <UszasnemSelect selected={uszasnem} onSelect={setUszasnem}/>
            {unsavedChanges ? (
                <Button onClick={doCommitChanges}>
                    {t("actions.generic.save_changes")}
                </Button>
            ) : null}
        </BorderCard>
    );
}

export function NevezesekList(props: {
    versenyszam: Versenyszam
}) {
    const t = useTranslation();

    const [nevezesek, loadingNevezesek] = useNevezesekList(props.versenyszam.id);
    const deleteNevezes = useDeleteNevezes();
    const [, setSearchParams] = useSearchParams();

    const displayedNevezesek = useMemo<Omit<DisplayedNevezes, "megjelent">[]>(() => {
        return nevezesek.map(value => {
            return {
                id: value.id,
                uszoNev: value.uszo.nev,
                uszoSzuletesiEv: (value.uszo as any)["szuletesiDatum"],
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
            <p>{t("versenyszam.no_uszo")}</p>
        </BorderCard>
    ) : (
        <Fragment>
            <DataTable dataList={displayedNevezesek} propertyNameOverride={{
                uszoNev: t("generic_label.uszo"),
                uszoSzuletesiEv: t("generic_label.year_of_birth"),
                csapatNev: t("generic_label.csapat"),
                nevezesiIdo: t("generic_label.nevezesi_ido"),
                idoeredmeny: t("generic_label.idoeredmeny")
            }} excludedProperties={["id"]} actionColumn={({id}) => (
                <Fragment>
                    <DestructiveIconButton confirmText={t("actions.generic.delete")}
                                           onClick={() => doDeleteNevezes(id)}>
                        {t("actions.generic.delete")}
                    </DestructiveIconButton>
                </Fragment>
            )}/>
            <Button variant="outlined" onClick={doOpenNewNevezesModal}>
                {t("actions.versenyszam.add_uszo")}
            </Button>
        </Fragment>
    );
}

function NevezesModal(props: {
    versenyszam: Versenyszam
}) {
    const t = useTranslation();

    const [, setSearchParams] = useSearchParams();
    const createNevezes = useCreateNevezes();

    const [csapat, setCsapat] = useState<number>(NaN);
    const [uszo, setUszo] = useState<number>(NaN);
    const [nevezesiIdo, setNevezesiIdo] = useState<string>();
    const [nevezesiIdoEnabled, setNevezesiIdoEnabled] = useState(false);

    const canComplete = useMemo(() => {
        return !!uszo &&
            (nevezesiIdoEnabled ?
                (!!nevezesiIdo && !nevezesiIdo.includes("_")) :
                true);
    }, [nevezesiIdo, nevezesiIdoEnabled, uszo]);

    const doDismiss = useCallback(() => {
        setSearchParams(prevState => {
            prevState.delete("modal");
            prevState.delete("versenyszamId");
            return prevState;
        });
    }, [setSearchParams]);

    const doComplete = useCallback(() => {
        if (!canComplete) {
            return;
        }

        createNevezes({
            megjelent: true,
            nevezesiIdo: nevezesiIdo,
            versenyszamId: props.versenyszam.id,
            uszoId: uszo
        }).then(message => {
            console.log(message);
            doDismiss();
        }).catch(console.error);
    }, [canComplete, createNevezes, doDismiss, nevezesiIdo, props.versenyszam, uszo]);

    useEffect(() => {
        setUszo(NaN);
    }, [csapat]);

    return (
        <FullPageModalWithActions icon="person"
                                  title={t("actions.versenyszam.add_uszo")}
                                  onComplete={doComplete} onDismiss={doDismiss}
                                  className="grid grid-rows-[auto_auto]
                                  grid-cols-[auto_auto]
                                  gap-y-2 gap-x-8 items-center p-6"
                                  canComplete={canComplete}>
            <label>{t("generic_label.csapat.with_colon")}</label>
            <CsapatSelect selected={csapat} onSelect={setCsapat}/>
            {csapat ? (
                <Fragment>
                    <label>{t("csapat.uszok.with_colon")}</label>
                    <UszoSelect csapatId={csapat} selected={uszo}
                                onSelect={setUszo}/>
                </Fragment>
            ) : null}
            {uszo ? (
                <Fragment>
                    <label>{t("generic_label.nevezesi_ido.with_colon")}</label>
                    <div className="flex flex-row gap-2 justify-items-start">
                        <CheckBox value={nevezesiIdoEnabled}
                                  onValue={setNevezesiIdoEnabled}/>
                        <IntervalMaskedInput value={nevezesiIdo}
                                             onValue={setNevezesiIdo}
                                             disabled={!nevezesiIdoEnabled}/>
                    </div>
                </Fragment>
            ) : null}
        </FullPageModalWithActions>
    );
}

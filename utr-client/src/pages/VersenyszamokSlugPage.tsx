import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {useSetAdminLayoutTitle} from "../hooks/useSetAdminLayoutTitle";
import {useVersenyszamDetails} from "../hooks/versenyszamok/useVersenyszamDetails";
import {useUszoversenyDetails} from "../hooks/uszoversenyek/useUszoversenyDetails";
import {LoadingSpinner} from "../components/LoadingSpinner";
import {PrimaryButton} from "../components/inputs/buttons/PrimaryButton";
import {BorderCard} from "../components/containers/BorderCard";
import {useDeleteVersenyszam} from "../hooks/versenyszamok/useDeleteVersenyszam";
import {WarningButton} from "../components/inputs/buttons/WarningButton";
import {Versenyszam} from "../types/model/Versenyszam";
import {EmberiNemId} from "../types/EmberiNemId";
import {UszasnemId} from "../types/UszasnemId";
import {NumberInput} from "../components/inputs/numeric/NumberInput";
import {CheckBox} from "../components/inputs/CheckBox";
import {VersenyszamNemDropdown} from "../components/inputs/dropdowns/VersenyszamNemDropdown";
import {UszasnemDropdown} from "../components/inputs/dropdowns/UszasnemDropdown";
import {SecondaryButton} from "../components/inputs/buttons/SecondaryButton";
import {useEditVersenyszam} from "../hooks/versenyszamok/useEditVersenyszam";
import {useNevezesekList} from "../hooks/nevezesek/useNevezesekList";
import {useDeleteNevezes} from "../hooks/nevezesek/useDeleteNevezes";
import {DataTable} from "../components/tables/DataTable";
import {DisplayedNevezes} from "../types/DisplayedNevezes";
import {formatInterval} from "../utils";
import {IconWarningButton} from "../components/inputs/buttons/IconWarningButton";
import {FullPageModal} from "../components/modals/FullPageModal";
import {CsapatDropdown} from "../components/inputs/dropdowns/CsapatDropdown";
import {TitleIcon} from "../components/icons/TitleIcon";
import {useCreateNevezes} from "../hooks/nevezesek/useCreateNevezes";
import {UszoDropdown} from "../components/inputs/dropdowns/UszoDropdown";
import {IntervalMaskedInput} from "../components/inputs/numeric/IntervalMaskedInput";
import {useTranslation} from "../hooks/translations/useTranslation";
import {useGetVersenyszamNemElnevezes} from "../hooks/useGetVersenyszamNemElnevezes";
import {useGetUszasnemElnevezes} from "../hooks/useGetUszasnemElnevezes";

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
                    <PrimaryButton text={t("actions.generic.back")}/>
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
                    <WarningButton text={t("actions.versenyszam.delete")}
                                   onClick={doDeleteVersenyszam}/>
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
            <VersenyszamNemDropdown selected={nem} onSelect={setNem}/>
            <p>{t("versenyszam.uszasnem")}</p>
            <UszasnemDropdown selected={uszasnem} onSelect={setUszasnem}/>
            {unsavedChanges ? (
                <SecondaryButton text={t("actions.generic.save_changes")}
                                 onClick={doCommitChanges}/>
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
                    <IconWarningButton iconName="delete"
                                       onClick={() => doDeleteNevezes(id)}/>
                </Fragment>
            )}/>
            <SecondaryButton text={t("actions.versenyszam.add_uszo")}
                             onClick={doOpenNewNevezesModal}/>
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
                <h2>{t("actions.versenyszam.add_uszo")}</h2>
            </div>
            <div className="w-full border border-slate-100"></div>
            <div className="grid grid-rows-[auto_auto] grid-cols-[auto_auto]
                        gap-y-2 gap-x-8 items-center p-6">
                <label>{t("generic_label.csapat.with_colon")}</label>
                <CsapatDropdown selected={csapat} onSelect={setCsapat}/>
                {csapat ? (
                    <Fragment>
                        <label>{t("csapat.uszok.with_colon")}</label>
                        <UszoDropdown csapatId={csapat} selected={uszo}
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
            </div>
            <div className="flex flex-row gap-2 p-6">
                <SecondaryButton text={t("generic_label.rather_not")}
                                 onClick={doCloseModal}/>
                <PrimaryButton text={t("generic_label.lets_go")}
                               onClick={doAddNevezes} disabled={!canAdd}/>
            </div>
        </FullPageModal>
    );
}

import {Link, useParams, useSearchParams} from "react-router-dom";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {useUszoversenyDetails} from "../hooks/uszoversenyek/useUszoversenyDetails";
import {useDeleteUszoverseny} from "../hooks/uszoversenyek/useDeleteUszoverseny";
import {useOpenUszoverseny} from "../hooks/uszoversenyek/useOpenUszoverseny";
import {useCloseUszoverseny} from "../hooks/uszoversenyek/useCloseUszoverseny";
import {useSetAdminLayoutTitle} from "../hooks/useSetAdminLayoutTitle";
import {LoadingSpinner} from "../components/LoadingSpinner";
import {PrimaryButton} from "../components/inputs/buttons/PrimaryButton";
import {BorderCard} from "../components/containers/BorderCard";
import {WarningButton} from "../components/inputs/buttons/WarningButton";
import {Uszoverseny} from "../types/model/Uszoverseny";
import {useVersenyszamokList} from "../hooks/versenyszamok/useVersenyszamokList";
import {useDeleteVersenyszam} from "../hooks/versenyszamok/useDeleteVersenyszam";
import {DataTable} from "../components/tables/DataTable";
import {IconButton} from "../components/inputs/buttons/IconButton";
import {IconWarningButton} from "../components/inputs/buttons/IconWarningButton";
import {SecondaryButton} from "../components/inputs/buttons/SecondaryButton";
import {DisplayedVersenyszam} from "../types/DisplayedVersenyszam";
import {useEditUszoverseny} from "../hooks/uszoversenyek/useEditUszoverseny";
import {TitleIcon} from "../components/icons/TitleIcon";
import {TextInput} from "../components/inputs/TextInput";
import {FullPageModal} from "../components/modals/FullPageModal";
import {DateInput} from "../components/inputs/DateInput";
import {useCreateVersenyszam} from "../hooks/versenyszamok/useCreateVersenyszam";
import {NumberInput} from "../components/inputs/numeric/NumberInput";
import {GenericDropdown} from "../components/inputs/dropdowns/GenericDropdown";
import {CheckBox} from "../components/inputs/CheckBox";
import {useTranslation} from "../hooks/translations/useTranslation";
import {useUszasnemDropdownList} from "../hooks/useUszasnemDropdownList";
import {useEmberiNemDropdownList} from "../hooks/useEmberiNemDropdownList";

export function UszoversenyekSlugPage() {
    const t = useTranslation();

    const {id} = useParams();
    const idNumber = useMemo(() => parseInt(id ?? "-1"), [id]);

    const [searchParams, setSearchParams] = useSearchParams();

    const [uszoverseny, uszoversenyLoading] = useUszoversenyDetails(idNumber);
    const deleteUszoverseny = useDeleteUszoverseny();
    const openUszoverseny = useOpenUszoverseny();
    const closeUszoverseny = useCloseUszoverseny();

    const doOpenEditUszoversenyModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.set("modal", "uszoverseny");
            return prevState;
        });
    }, [setSearchParams]);

    const doDeleteUszoverseny = useCallback(() => {
        if (!!uszoverseny) {
            deleteUszoverseny(uszoverseny.id)
                .then(console.log)
                .catch(console.error);
        }
    }, [deleteUszoverseny, uszoverseny]);

    const doOpenUszoverseny = useCallback(() => {
        if (!!uszoverseny) {
            openUszoverseny(uszoverseny.id)
                .then(console.log)
                .catch(console.error);
        }
    }, [openUszoverseny, uszoverseny]);

    const doCloseUszoverseny = useCallback(() => {
        if (!!uszoverseny && uszoverseny.nyitott) {
            closeUszoverseny()
                .then(console.log)
                .catch(console.error);
        } else {
            console.error(t("error.page.cannot_close_uszoverseny"));
        }
    }, [closeUszoverseny, t, uszoverseny]);

    useSetAdminLayoutTitle(!uszoverseny ? t("generic_label.loading")! : uszoverseny.nev);

    return uszoversenyLoading ? (
        <div className="w-full h-full grid place-content-center">
            <LoadingSpinner/>
        </div>
    ) : !uszoverseny ? (
        <div className="h-full grid place-content-center">
            <div className="flex flex-col gap-2 items-center">
                <p>{t("uszoverseny.not_found")}</p>
                <Link to=".." relative="path">
                    <PrimaryButton text={t("actions.generic.back")!}/>
                </Link>
            </div>
        </div>
    ) : (
        <Fragment>
            <div className="w-full flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h3 className="ml-2">{t("generic_label.generic_info.with_colon")}</h3>
                    <BorderCard className="grid grid-cols-2">
                        <p>Dátum: </p>
                        <p><b>{uszoverseny.datum.toLocaleDateString()}</b></p>
                        <p>Helyszín: </p>
                        <p><b>{uszoverseny.helyszin}</b></p>
                    </BorderCard>
                    <div className="flex flex-row gap-2 flex-wrap">
                        <PrimaryButton text={t("actions.uszoverseny.edit_details")!}
                                       onClick={doOpenEditUszoversenyModal}/>
                        {uszoverseny.nyitott ? (
                            <WarningButton text={t("actions.uszoverseny.close")!}
                                           onClick={doCloseUszoverseny}/>
                        ) : (
                            <SecondaryButton text={t("actions.uszoverseny.open")!}
                                             onClick={doOpenUszoverseny}/>
                        )}
                        <WarningButton text={t("actions.uszoverseny.delete")!}
                                       onClick={doDeleteUszoverseny}/>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="ml-2 col-span-2">{t("uszoversenyek.versenyszamok")}</h3>
                    <VersenyszamokList uszoverseny={uszoverseny}/>
                </div>
            </div>
            {searchParams.get("modal") === "uszoverseny" ? (
                <UszoversenyModal uszoverseny={uszoverseny}/>
            ) : searchParams.get("modal") === "versenyszam" ? (
                <VersenyszamModal uszoverseny={uszoverseny}/>
            ) : null}
        </Fragment>
    );
}

function VersenyszamokList(props: {
    uszoverseny?: Uszoverseny
}) {
    const t = useTranslation();

    const [versenyszamok, versenyszamokLoading] = useVersenyszamokList(props.uszoverseny?.id);
    const deleteVersenyszam = useDeleteVersenyszam();
    const [, setSearchParams] = useSearchParams();

    const displayedVersenyszamok = useMemo<DisplayedVersenyszam[]>(() => {
        return versenyszamok.map(value => {
            return {
                id: value.id,
                valto: !!value.valto ? `${value.valto}x` : "",
                hossz: `${value.hossz}m`,
                nem: value.nem === "F" ?
                    t("generic_label.female.versenyszam") as "fiú" :
                    t("generic_label.male.versenyszam") as "lány",
                uszasnem: value.uszasnem.elnevezes
            };
        });
    }, [t, versenyszamok]);

    const doOpenNewVersenyszamModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.set("modal", "versenyszam");
            return prevState;
        });
    }, [setSearchParams]);

    const doDeleteVersenyszam = useCallback((id: number) => {
        deleteVersenyszam(id).then(console.log).catch(console.error);
    }, [deleteVersenyszam]);

    return versenyszamokLoading ? (
        <div className="grid place-content-center">
            <LoadingSpinner/>
        </div>
    ) : !versenyszamok || !versenyszamok.length ? (
        <BorderCard>
            <p>{t("uszoversenyek.no_versenyszam")}</p>
        </BorderCard>
    ) : (
        <Fragment>
            <DataTable dataList={displayedVersenyszamok} propertyNameOverride={{
                valto: t("generic_label.valto")!,
                uszasnem: t("generic_label.uszasnem")
            }} excludedProperties={["id"]}
                       actionColumn={({id}) => (
                           <Fragment>
                               <Link to={`versenyszamok/${id}`}>
                                   <IconButton iconName="edit"/>
                               </Link>
                               <IconWarningButton iconName="delete"
                                                  onClick={() => {
                                                      doDeleteVersenyszam(id);
                                                  }}/>
                           </Fragment>
                       )}/>
            <SecondaryButton text={t("actions.versenyszam.create")!}
                             onClick={doOpenNewVersenyszamModal}/>
        </Fragment>
    );
}

function UszoversenyModal(props: {
    uszoverseny?: Uszoverseny
}) {
    const t = useTranslation();

    const [, setSearchParams] = useSearchParams();
    const editUszoverseny = useEditUszoverseny();

    const [nev, setNev] = useState(props.uszoverseny?.nev ?? "");
    const [datum, setDatum] = useState(props.uszoverseny?.datum.getTime() ?? Date.now());
    const [helyszin, setHelyszin] = useState(props.uszoverseny?.helyszin);

    const doCloseModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.delete("modal");
            return prevState;
        });
    }, [setSearchParams]);

    const doEdit = useCallback(() => {
        if (!!props.uszoverseny) {
            editUszoverseny(props.uszoverseny.id, {
                nev, datum: new Date(datum), helyszin
            }).then(console.log);
            doCloseModal();
        }
    }, [props.uszoverseny, editUszoverseny, nev, datum, helyszin, doCloseModal]);

    useEffect(() => {
        if (!!props.uszoverseny) {
            setNev(props.uszoverseny.nev);
            setDatum(props.uszoverseny.datum.getTime());
            setHelyszin(props.uszoverseny.helyszin);
        }
    }, [props.uszoverseny]);

    return (
        <FullPageModal className="flex flex-col">
            <div className="flex flex-row items-center justify-start gap-6 p-6
            min-w-max max-w-sm">
                <TitleIcon name="edit"/>
                <h2>{t("actions.uszoverseny.edit")}</h2>
            </div>
            <div className="w-full border border-slate-100"></div>
            <div className="flex flex-col gap-2 p-6">
                <TextInput value={nev} onValue={setNev}
                           placeholder={t("csapat.name")}/>
                <DateInput value={datum} onValue={setDatum}/>
                {!!helyszin ? (
                    <TextInput value={helyszin} onValue={setHelyszin}
                               placeholder={t("csapat.city")}/>
                ) : null}
            </div>
            <div className="flex flex-row gap-2 p-6">
                <SecondaryButton text={t("generic_label.rather_not")!} onClick={doCloseModal}/>
                <PrimaryButton text={t("actions.generic.lets_load_again")!} onClick={doEdit}/>
            </div>
        </FullPageModal>
    );
}

function VersenyszamModal(props: {
    uszoverseny?: Uszoverseny
}) {
    const t = useTranslation();

    const uszasnemList = useUszasnemDropdownList();
    const emberiNemList = useEmberiNemDropdownList();

    const [searchParams, setSearchParams] = useSearchParams();
    const createVersenyszam = useCreateVersenyszam();

    const [hossz, setHossz] = useState<number>(25);
    const [uszasnem, setUszasnem] = useState("-");
    const [emberiNem, setEmberiNem] = useState("-");
    const [valto, setValto] = useState<number>(4);
    const [valtoEnabled, setValtoEnabled] = useState(false);

    const canCreate = useMemo(() => {
        return !!hossz && uszasnem !== "-" && emberiNem !== "-";
    }, [emberiNem, hossz, uszasnem]);

    const doCloseModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.delete("modal");
            prevState.delete("versenyszamId");
            return prevState;
        });
    }, [setSearchParams]);

    const doCommitChanges = useCallback(() => {
        if (!!props.uszoverseny && canCreate) {
            createVersenyszam({
                hossz: hossz,
                valto: valtoEnabled ? valto : undefined,
                emberiNemId: emberiNem === "fiú" ? "F" : "N",
                uszasnemId: uszasnemList.indexOf(uszasnem),
                versenyId: props.uszoverseny.id
            }).then(message => {
                console.log(message);
                doCloseModal();
            }).catch(console.error);
        }
    }, [
        canCreate, createVersenyszam, doCloseModal, emberiNem,
        hossz, props.uszoverseny, uszasnem, uszasnemList, valto, valtoEnabled
    ]);

    return (
        <FullPageModal className="flex flex-col">
            <div className="flex flex-row items-center
                    justify-start gap-6 p-6 min-w-max max-w-sm">
                <TitleIcon name="person"/>
                <h2>
                    {searchParams.has("versenyszamId") ?
                        t("actions.versenyszam.edit") :
                        t("actions.versenyszam.create")}
                </h2>
            </div>
            <div className="w-full border border-slate-100"></div>
            <div className="flex flex-col gap-2 p-6">
                <div className="grid grid-rows-2 grid-cols-[auto_auto]
                        gap-y-2 gap-x-8 items-center">
                    <label>{t("versenyszam.valto")}</label>
                    <div className="flex flex-row gap-2 justify-items-start">
                        <CheckBox value={valtoEnabled} onValue={setValtoEnabled}/>
                        <NumberInput value={valto} onValue={setValto} min={1} max={8}
                                     disabled={!valtoEnabled}/>
                    </div>
                    <label>{t("versenyszam.hossz")}</label>
                    <NumberInput value={hossz} onValue={setHossz} min={25} max={200}/>
                    <label>{t("versenyszam.nem")}</label>
                    <GenericDropdown options={emberiNemList} onSelect={value => {
                        setEmberiNem(value);
                    }} selected={emberiNem}/>
                    <label>{t("versenyszam.uszasnem")}</label>
                    <GenericDropdown options={uszasnemList} onSelect={value => {
                        setUszasnem(value);
                    }} selected={uszasnem}/>
                </div>
            </div>
            <div className="flex flex-row gap-2 p-6">
                <SecondaryButton text={t("generic_label.rather_not")!}
                                 onClick={doCloseModal}/>
                <PrimaryButton text={t("generic_label.lets_go")!}
                               onClick={doCommitChanges} disabled={!canCreate}/>
            </div>
        </FullPageModal>
    );
}

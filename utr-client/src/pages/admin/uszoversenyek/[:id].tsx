import {Link, useParams, useSearchParams} from "react-router-dom";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {useUszoversenyDetails} from "../../../hooks/uszoversenyek/useUszoversenyDetails";
import {useDeleteUszoverseny} from "../../../hooks/uszoversenyek/useDeleteUszoverseny";
import {useOpenUszoverseny} from "../../../hooks/uszoversenyek/useOpenUszoverseny";
import {useCloseUszoverseny} from "../../../hooks/uszoversenyek/useCloseUszoverseny";
import {useSetAdminLayoutTitle} from "../../../hooks/useSetAdminLayoutTitle";
import {LoadingSpinner} from "../../../components/LoadingSpinner";
import {PrimaryButton} from "../../../components/inputs/PrimaryButton";
import {BorderCard} from "../../../components/containers/BorderCard";
import {WarningButton} from "../../../components/inputs/WarningButton";
import {Uszoverseny} from "../../../types/model/Uszoverseny";
import {useVersenyszamokList} from "../../../hooks/versenyszamok/useVersenyszamokList";
import {useDeleteVersenyszam} from "../../../hooks/versenyszamok/useDeleteVersenyszam";
import {DataTable} from "../../../components/tables/DataTable";
import {IconButton} from "../../../components/inputs/IconButton";
import {IconWarningButton} from "../../../components/inputs/IconWarningButton";
import {SecondaryButton} from "../../../components/inputs/SecondaryButton";
import {DisplayedVersenyszam} from "../../../types/DisplayedVersenyszam";
import {useEditUszoverseny} from "../../../hooks/uszoversenyek/useEditUszoverseny";
import {TitleIcon} from "../../../components/icons/TitleIcon";
import {TextInput} from "../../../components/inputs/TextInput";
import {FullPageModal} from "../../../components/modals/FullPageModal";
import {DateInput} from "../../../components/inputs/DateInput";
import {useCreateVersenyszam} from "../../../hooks/versenyszamok/useCreateVersenyszam";
import {NumberInput} from "../../../components/inputs/NumberInput";
import {GenericDropdown} from "../../../components/inputs/dropdowns/GenericDropdown";
import {CheckBox} from "../../../components/inputs/CheckBox";

export function UszoversenyekSlugPage() {
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
            console.error("Az úszóverseny nincs nyitva, ezért nem lehet bezárni.");
        }
    }, [closeUszoverseny, uszoverseny]);

    useSetAdminLayoutTitle(!uszoverseny ? "Betöltés..." : uszoverseny.nev);

    return uszoversenyLoading ? (
        <div className="w-full h-full grid place-content-center">
            <LoadingSpinner/>
        </div>
    ) : !uszoverseny ? (
        <div className="h-full grid place-content-center">
            <div className="flex flex-col gap-2 items-center">
                <p>Úszóverseny nem található</p>
                <Link to=".." relative="path">
                    <PrimaryButton text="Vissza"/>
                </Link>
            </div>
        </div>
    ) : (
        <Fragment>
            <div className="w-full flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h3 className="ml-2">Általános információ:</h3>
                    <BorderCard className="grid grid-cols-2">
                        <p>Dátum: </p>
                        <p><b>{uszoverseny.datum.toLocaleDateString()}</b></p>
                        <p>Helyszín: </p>
                        <p><b>{uszoverseny.helyszin}</b></p>
                    </BorderCard>
                    <div className="flex flex-row gap-2 flex-wrap">
                        <PrimaryButton text="Úszóverseny adatainak szerkesztése"
                                       onClick={doOpenEditUszoversenyModal}/>
                        {uszoverseny.nyitott ? (
                            <WarningButton text="Úszóverseny lezárása"
                                           onClick={doCloseUszoverseny}/>
                        ) : (
                            <SecondaryButton text="Úszóverseny megnyitása"
                                             onClick={doOpenUszoverseny}/>
                        )}
                        <WarningButton text="Úszóverseny törlése"
                                       onClick={doDeleteUszoverseny}/>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="ml-2 col-span-2">Versenyszámok:</h3>
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
    const [versenyszamok, versenyszamokLoading] = useVersenyszamokList(props.uszoverseny?.id);
    const deleteVersenyszam = useDeleteVersenyszam();
    const [, setSearchParams] = useSearchParams();

    const displayedVersenyszamok = useMemo<DisplayedVersenyszam[]>(() => {
        return versenyszamok.map(value => {
            return {
                id: value.id,
                valto: !!value.valto ? `${value.valto}x` : "",
                hossz: `${value.hossz}m`,
                nem: value.nem === "F" ? "fiú" : "lány",
                uszasnem: value.uszasnem.elnevezes
            };
        });
    }, [versenyszamok]);

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
            <p>
                Jelenleg egy versenyszám sincs felvéve az úszóversenyhez.
                Adjunk hozzá egyet?
            </p>
        </BorderCard>
    ) : (
        <Fragment>
            <DataTable dataList={displayedVersenyszamok} propertyNameOverride={{
                valto: "váltó",
                uszasnem: "úszásnem"
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
            <SecondaryButton text="Versenyszám hozzáadása"
                             onClick={doOpenNewVersenyszamModal}/>
        </Fragment>
    );
}

function UszoversenyModal(props: {
    uszoverseny?: Uszoverseny
}) {
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
                <h2>Úszóverseny szerkesztése</h2>
            </div>
            <div className="w-full border border-slate-100"></div>
            <div className="flex flex-col gap-2 p-6">
                <TextInput value={nev} onValue={setNev}
                           placeholder="Csapat neve"/>
                <DateInput value={datum} onValue={setDatum}/>
                {!!helyszin ? (
                    <TextInput value={helyszin} onValue={setHelyszin}
                               placeholder="Város"/>
                ) : null}
            </div>
            <div className="flex flex-row gap-2 p-6">
                <SecondaryButton text="Inkább nem" onClick={doCloseModal}/>
                <PrimaryButton text="Mehet!" onClick={doEdit}/>
            </div>
        </FullPageModal>
    );
}

const USZASNEM_LIST = ["-", "gyorsúszás", "mellúszás", "hátúszás", "pillangóúszás"] as const;
const EMBERI_NEM_LIST = ["-", "fiú", "leány"] as const;

function VersenyszamModal(props: {
    uszoverseny?: Uszoverseny
}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const createVersenyszam = useCreateVersenyszam();

    const [hossz, setHossz] = useState<number>(25);
    const [uszasnem, setUszasnem] = useState<typeof USZASNEM_LIST[number]>("-");
    const [emberiNem, setEmberiNem] = useState<typeof EMBERI_NEM_LIST[number]>("-");
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
                uszasnemId: USZASNEM_LIST.indexOf(uszasnem),
                versenyId: props.uszoverseny.id
            }).then(message => {
                console.log(message);
                doCloseModal();
            }).catch(console.error);
        }
    }, [canCreate, createVersenyszam, doCloseModal, emberiNem, hossz,
        props.uszoverseny, uszasnem, valto, valtoEnabled
    ]);

    return (
        <FullPageModal className="flex flex-col">
            <div className="flex flex-row items-center
                    justify-start gap-6 p-6 min-w-max max-w-sm">
                <TitleIcon name="person"/>
                <h2>
                    {searchParams.has("versenyszamId") ? "Versenyszám szerkesztése" :
                        "Versenyszám hozzáadása"}
                </h2>
            </div>
            <div className="w-full border border-slate-100"></div>
            <div className="flex flex-col gap-2 p-6">
                <div className="grid grid-rows-2 grid-cols-[auto_auto]
                        gap-y-2 gap-x-8 items-center">
                    <label>Váltó:</label>
                    <div className="flex flex-row gap-2 justify-items-start">
                        <CheckBox value={valtoEnabled} onValue={setValtoEnabled}/>
                        <NumberInput value={valto} onValue={setValto} min={1} max={8}
                                     disabled={!valtoEnabled}/>
                    </div>
                    <label>Hossz:</label>
                    <NumberInput value={hossz} onValue={setHossz} min={25} max={200}/>
                    <label>Nem:</label>
                    <GenericDropdown options={EMBERI_NEM_LIST} onSelect={value => {
                        setEmberiNem(value);
                    }} selected={emberiNem}/>
                    <label>Úszásnem:</label>
                    <GenericDropdown options={USZASNEM_LIST} onSelect={value => {
                        setUszasnem(value);
                    }} selected={uszasnem}/>
                </div>
            </div>
            <div className="flex flex-row gap-2 p-6">
                <SecondaryButton text="Inkább nem" onClick={doCloseModal}/>
                <PrimaryButton text="Mehet!" onClick={doCommitChanges}
                               disabled={!canCreate}/>
            </div>
        </FullPageModal>
    );
}

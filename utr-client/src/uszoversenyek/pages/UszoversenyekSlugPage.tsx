import {Link, useParams, useSearchParams} from "react-router-dom";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {Uszoverseny} from "../../types/model/Uszoverseny";
import {DateInput} from "../../components/inputs/DateInput";
import {EmberiNemId} from "../../types/EmberiNemId";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    ChipProps,
    Dialog,
    Input,
    Spinner,
    Typography
} from "@material-tailwind/react";
import {DestructiveButton} from "../../components/buttons";
import {DataTable, DataTableDataColumn} from "../../components/tables";
import {DataTableActionColumn} from "../../components/tables/DataTableActionColumn";
import {UszasnemId} from "../../types/UszasnemId";
import {PlusIcon} from "@heroicons/react/24/solid";
import {VersenyszamEditLayout} from "../../layouts/VersenyszamEditLayout";
import {
    useCloseUszoverseny,
    useDeleteUszoverseny,
    useEditUszoverseny,
    useOpenUszoverseny,
    useUszoversenyDetails
} from "../hooks";
import {useTranslation} from "../../translations/hooks";
import {
    useCreateVersenyszam,
    useDeleteVersenyszam,
    useVersenyszamokList
} from "../../versenyszamok/hooks";
import {
    useGetUszasnemElnevezes,
    useGetVersenyszamNemElnevezes,
    useSetAdminLayoutTitle
} from "../../utils/hooks";

const CREATE_RACE_PARAM_KEY = "race";

export function UszoversenyekSlugPage() {
    const t = useTranslation();

    const {id} = useParams();
    const idNumber = useMemo(() => parseInt(id ?? "-1"), [id]);

    const [uszoverseny, uszoversenyLoading] = useUszoversenyDetails(idNumber);

    useSetAdminLayoutTitle(!uszoverseny ? t("generic_label.loading") : uszoverseny.nev);

    return uszoversenyLoading ? (
        <div className="w-full h-full grid place-content-center">
            <Spinner/>
        </div>
    ) : !uszoverseny ? (
        <div className="h-full grid place-content-center">
            <div className="flex flex-col gap-2 items-center">
                <p>{t("uszoverseny.not_found")}</p>
                <Link to=".." relative="path">
                    <Button color="blue">{t("actions.generic.back")}</Button>
                </Link>
            </div>
        </div>
    ) : (
        <Fragment>
            <div className="w-full flex flex-col gap-12 items-start">
                <UszoversenyDetailsForm uszoverseny={uszoverseny}/>
                <VersenyszamokList uszoverseny={uszoverseny}/>
            </div>
            <VersenyszamModal uszoverseny={uszoverseny}/>
        </Fragment>
    );
}

function UszoversenyDetailsForm(props: {
    uszoverseny: Uszoverseny
}) {
    const t = useTranslation();
    const editUszoverseny = useEditUszoverseny();
    const deleteUszoverseny = useDeleteUszoverseny();
    const openUszoverseny = useOpenUszoverseny();
    const closeUszoverseny = useCloseUszoverseny();

    const [isDirty, setIsDirty] = useState(false);
    const [nev, setNev] = useState(props.uszoverseny.nev);
    const [helyszin, setHelyszin] = useState(props.uszoverseny.helyszin);
    const [datum, setDatum] = useState(props.uszoverseny.datum.getTime());

    const doCommitChanges = useCallback(() => {
        editUszoverseny(props.uszoverseny.id, {
            nev: nev,
            datum: new Date(datum),
            helyszin: helyszin
        }).then(message => {
            console.log(message);
            setIsDirty(false);
        }).catch(console.error);
    }, [datum, editUszoverseny, helyszin, nev, props.uszoverseny]);

    const doDeleteUszoverseny = useCallback(() => {
        deleteUszoverseny(props.uszoverseny.id)
            .then(console.log)
            .catch(console.error);
    }, [deleteUszoverseny, props.uszoverseny]);

    const doChangeOpenedState = useCallback(() => {
        if (props.uszoverseny.nyitott) {
            closeUszoverseny()
                .then(console.log)
                .catch(console.error);
        } else {
            openUszoverseny(props.uszoverseny.id)
                .then(console.log)
                .catch(console.error);
        }
    }, [closeUszoverseny, openUszoverseny, props.uszoverseny]);

    useEffect(() => {
        setIsDirty(
            props.uszoverseny.nev !== nev ||
            props.uszoverseny.helyszin !== helyszin ||
            props.uszoverseny.datum.getTime() !== datum
        );
    }, [datum, helyszin, nev, props.uszoverseny]);

    return (
        <Card className="w-full mt-6">
            <CardHeader variant="gradient" color="blue-gray" className="p-4 mb-4 text-center">
                <Typography variant="h5">
                    {props.uszoverseny.nev}
                </Typography>
            </CardHeader>
            <CardBody>
                <form className="flex flex-col gap-4">
                    <Input label={t("uszoverseny.elnevezes")} value={nev} onChange={event => {
                        setNev(event.currentTarget.value);
                    }}/>
                    <Input label={t("generic_label.location")} value={helyszin} onChange={event => {
                        setHelyszin(event.currentTarget.value);
                    }}/>
                    <DateInput value={datum} onValue={setDatum}/>
                </form>
            </CardBody>
            <CardFooter className="flex flex-row gap-2">
                <Button color="blue" disabled={!isDirty} onClick={doCommitChanges}>
                    {t("actions.generic.save_changes")}
                </Button>
                <Button variant={props.uszoverseny.nyitott ? "filled" : "outlined"}
                        color={props.uszoverseny.nyitott ? "red" : "blue-gray"}
                        onClick={doChangeOpenedState}>
                    {props.uszoverseny.nyitott ?
                        t("actions.uszoverseny.close") :
                        t("actions.uszoverseny.open")}
                </Button>
                <DestructiveButton confirmText={t("confirm.generic.delete")}
                                   onConfirm={doDeleteUszoverseny}>
                    {t("actions.uszoverseny.delete")}
                </DestructiveButton>
            </CardFooter>
        </Card>
    );
}

const SWIMMING_STYLE_COLOURS: { [key in UszasnemId]: ChipProps["color"] } = {
    USZASNEM_HAT: "teal",
    USZASNEM_GYORS: "brown",
    USZASNEM_MELL: "indigo",
    USZASNEM_PILLANGO: "light-green"
} as const;

function VersenyszamokList(props: {
    uszoverseny?: Uszoverseny
}) {
    const t = useTranslation();
    const getVersenyszamNemElnevezes = useGetVersenyszamNemElnevezes();
    const getUszasnemElnevezes = useGetUszasnemElnevezes();

    const [versenyszamok, versenyszamokLoading] = useVersenyszamokList(props.uszoverseny?.id);
    const deleteVersenyszam = useDeleteVersenyszam();
    const [, setSearchParams] = useSearchParams();

    const doOpenNewVersenyszamModal = useCallback(() => {
        setSearchParams(prevState => {
            prevState.set("modal", CREATE_RACE_PARAM_KEY);
            return prevState;
        });
    }, [setSearchParams]);

    const doDeleteVersenyszam = useCallback((id: number) => {
        deleteVersenyszam(id).then(console.log).catch(console.error);
    }, [deleteVersenyszam]);

    return versenyszamokLoading ? (
        <div className="grid place-content-center">
            <Spinner/>
        </div>
    ) : !versenyszamok || !versenyszamok.length ? (
        <Card className="w-full">
            <CardBody>
                <Typography variant="lead" className="text-center">
                    {t("uszoversenyek.no_versenyszam")}
                </Typography>
            </CardBody>
            <CardFooter className="grid place-content-center">
                <Button color="blue" variant="outlined" onClick={doOpenNewVersenyszamModal}>
                    {t("actions.versenyszam.create")}
                </Button>
            </CardFooter>
        </Card>
    ) : (
        <Card className="w-full">
            <CardHeader variant="gradient" color="blue-gray"
                        className="p-4 mb-4 text-center">
                <Typography variant="h5">
                    {t("generic_label.all_uszoversenyek")}
                </Typography>
            </CardHeader>
            <CardBody>
                <DataTable dataList={versenyszamok} excludedProperties={["id"]}>
                    <DataTableDataColumn list={versenyszamok} forKey="valto"
                                         header={t("generic_label.valto")}
                                         element={value => (
                                             <Typography variant="small"
                                                         className="font-normal">
                                                 {value ? `${value}x` : ""}
                                             </Typography>
                                         )}/>
                    <DataTableDataColumn list={versenyszamok} forKey="hossz"
                                         header={t("versenyszam.hossz")}
                                         element={value => (
                                             <Typography variant="small"
                                                         className="font-normal">
                                                 {value}m
                                             </Typography>
                                         )}/>
                    <DataTableDataColumn list={versenyszamok} forKey="nem"
                                         header={t("generic_label.nem")}
                                         element={value => (
                                             <Chip value={getVersenyszamNemElnevezes(value)}
                                                   className="w-min" variant="ghost"
                                                   color={value === "NEM_FERFI" ?
                                                       "light-blue" : "pink"}/>
                                         )}/>
                    <DataTableDataColumn list={versenyszamok} forKey="uszasnem"
                                         header={t("generic_label.uszasnem")}
                                         element={value => (
                                             <Chip value={getUszasnemElnevezes(value)}
                                                   className="w-min" variant="ghost"
                                                   color={SWIMMING_STYLE_COLOURS[value]}/>
                                         )}/>
                    <DataTableActionColumn list={versenyszamok} element={entry => (
                        <Fragment>
                            <Link to={`versenyszamok/${entry.id}`} relative="path">
                                <Button variant="text" color="blue-gray">
                                    {t("actions.generic.edit")}
                                </Button>
                            </Link>
                            <Button variant="text" color="red" onClick={() => {
                                doDeleteVersenyszam(entry.id);
                            }}>
                                {t("actions.generic.delete")}
                            </Button>
                        </Fragment>
                    )}/>
                </DataTable>
            </CardBody>
            <CardFooter>
                <Button color="blue" variant="outlined" onClick={doOpenNewVersenyszamModal}>
                    {t("actions.versenyszam.create")}
                </Button>
            </CardFooter>
        </Card>
    );
}

function VersenyszamModal(props: {
    uszoverseny?: Uszoverseny
}) {
    const t = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const createVersenyszam = useCreateVersenyszam();

    const open = useMemo(() => {
        return searchParams.has("modal") && searchParams.get("modal") === CREATE_RACE_PARAM_KEY;
    }, [searchParams]);

    const setOpen = useCallback((open: boolean) => {
        setSearchParams(state => {
            if (open) state.set("modal", CREATE_RACE_PARAM_KEY);
            else state.delete("modal");

            return state;
        });
    }, [setSearchParams]);

    const [hossz, setHossz] = useState<number>(25);
    const [uszasnem, setUszasnem] = useState<UszasnemId>("USZASNEM_GYORS");
    const [versenyszamNem, setVersenyszamNem] = useState<EmberiNemId>("NEM_FERFI");
    const [valto, setValto] = useState<number>(0);

    const canComplete = useMemo(() => {
        return !!hossz;
    }, [hossz]);

    const doDismiss = useCallback(() => {
        setSearchParams(prevState => {
            prevState.delete("modal");
            prevState.delete("versenyszamId");
            return prevState;
        });
    }, [setSearchParams]);

    const doComplete = useCallback(() => {
        if (!!props.uszoverseny && canComplete) {
            createVersenyszam({
                hossz: hossz,
                valto: valto === 0 ? undefined : valto,
                emberiNemId: versenyszamNem,
                uszasnemId: uszasnem,
                versenyId: props.uszoverseny.id
            }).then(message => {
                console.log(message);
                doDismiss();
            }).catch(console.error);
        }
    }, [canComplete, createVersenyszam, doDismiss, versenyszamNem,
        hossz, props.uszoverseny, uszasnem, valto]);

    return (
        <Dialog open={open} handler={setOpen}>
            <Card>
                <CardHeader variant="gradient" color="blue-gray"
                            className="p-4 mb-4 text-center
                            flex flex-row items-center justify-center gap-4">
                    <PlusIcon className="w-8"/>
                    <Typography variant="h5">
                        {t("actions.versenyszam.create")}
                    </Typography>
                </CardHeader>
                <CardBody className="grid grid-rows-2 grid-cols-2 gap-2">
                    <VersenyszamEditLayout valto={valto} hossz={hossz}
                                           versenyszamNem={versenyszamNem} uszasnem={uszasnem}
                                           setValto={setValto} setHossz={setHossz}
                                           setVersenyszamNem={setVersenyszamNem}
                                           setUszasnem={setUszasnem}/>
                </CardBody>
                <CardFooter className="flex flex-row gap-2">
                    <Button color="blue" variant="outlined" fullWidth
                            onClick={() => setOpen(false)}>
                        {t("generic_label.rather_not")}
                    </Button>
                    <Button color="blue" variant="filled" fullWidth onClick={doComplete}
                            disabled={!canComplete}>
                        {t("generic_label.lets_go")}
                    </Button>
                </CardFooter>
            </Card>
        </Dialog>
    );
}

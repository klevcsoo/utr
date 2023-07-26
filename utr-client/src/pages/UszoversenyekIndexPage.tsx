import {useUszoversenyekList} from "../hooks/uszoversenyek/useUszoversenyekList";
import {Link, useSearchParams} from "react-router-dom";
import {useSetAdminLayoutTitle} from "../hooks/useSetAdminLayoutTitle";
import {Fragment, useCallback, useMemo, useState} from "react";
import {DataTable} from "../components/tables/DataTable";
import {DateInput} from "../components/inputs/DateInput";
import {useOpenUszoverseny} from "../hooks/uszoversenyek/useOpenUszoverseny";
import {useNyitottVerseny} from "../hooks/nyitottVerseny/useNyitottVerseny";
import {useCloseUszoverseny} from "../hooks/uszoversenyek/useCloseUszoverseny";
import {Uszoverseny} from "../types/model/Uszoverseny";
import {useCreateUszoverseny} from "../hooks/uszoversenyek/useCreateUszoverseny";
import {useTranslation} from "../hooks/translations/useTranslation";
import {DestructiveButton, DestructiveIconButton} from "../components/buttons";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Dialog,
    IconButton,
    Input,
    Spinner,
    Typography
} from "@material-tailwind/react";
import {LockClosedIcon, LockOpenIcon, PencilIcon, PlusIcon} from "@heroicons/react/24/solid";

export function UszoversenyekIndexPage() {
    const t = useTranslation();

    useSetAdminLayoutTitle(t("title.admin_layout.uszoversenyek"));

    return (
        <Fragment>
            <div className="w-full flex flex-col gap-12 items-start">
                <NyitottUszoversenyCard/>
                <UszoversenyekList/>
            </div>
            <NewUszoversenyModal/>
        </Fragment>
    );
}

function NyitottUszoversenyCard() {
    const t = useTranslation();
    const [nyitottVerseny, loadingNyitottVerseny] = useNyitottVerseny();

    return loadingNyitottVerseny ? (
        <Spinner/>
    ) : !nyitottVerseny ? null : (
        <Card className="w-full mt-6">
            <CardHeader variant="gradient" color="blue-gray" className="p-4 mb-4 text-center">
                <Typography variant="h5">{t("uszoverseny.opened")}</Typography>
            </CardHeader>
            <CardBody>
                <Typography variant="lead">{nyitottVerseny.nev}</Typography>
                <Typography>
                    {nyitottVerseny.helyszin} ·&nbsp;
                    {nyitottVerseny.datum.toLocaleDateString()}
                </Typography>
            </CardBody>
            <CardFooter className="flex flex-row gap-2">
                <DestructiveButton className="max-w-xs" fullWidth
                                   confirmText={t("actions.uszoverseny.close")}>
                    {t("actions.uszoverseny.close")}
                </DestructiveButton>
                <Link to={String(nyitottVerseny.id)} className="w-full">
                    <Button color="blue-gray" variant="outlined" className="max-w-xs" fullWidth>
                        {t("actions.generic.view_details")}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}

function UszoversenyekList() {
    const t = useTranslation();
    const [, setSearchParams] = useSearchParams();

    const [uszoversenyek, uszoversenyekLoading] = useUszoversenyekList();
    const [nyitottVerseny, loadingNyitottVerseny] = useNyitottVerseny();
    const openUszoverseny = useOpenUszoverseny();
    const closeUszoverseny = useCloseUszoverseny();

    const existsOpenUszoverseny = useMemo(() => {
        return !!nyitottVerseny && !loadingNyitottVerseny;
    }, [loadingNyitottVerseny, nyitottVerseny]);

    const doChangeVersenyNyitottState = useCallback((uszoverseny: Uszoverseny) => {
        (uszoverseny.nyitott ? closeUszoverseny() : openUszoverseny(uszoverseny.id))
            .then(console.log)
            .catch(console.error);
    }, [closeUszoverseny, openUszoverseny]);

    const actionColumn = useCallback((entry: Uszoverseny) => (
        <Fragment>
            <DestructiveIconButton confirmText={t("confirm.uszoverseny.close")}
                                   onConfirm={() => {
                                       doChangeVersenyNyitottState(entry);
                                   }}
                                   disabled={
                                       existsOpenUszoverseny && !entry.nyitott
                                   }>
                {entry.nyitott ? (
                    <LockClosedIcon className="w-5"/>
                ) : (
                    <LockOpenIcon className="w-5"/>
                )}
            </DestructiveIconButton>
            <Link to={String(entry.id)}>
                <IconButton color="blue-gray">
                    <PencilIcon className="w-5"/>
                </IconButton>
            </Link>
        </Fragment>
    ), [doChangeVersenyNyitottState, existsOpenUszoverseny, t]);

    return uszoversenyekLoading ? (
        <Spinner/>
    ) : (
        <Card className="w-full">
            <CardHeader variant="gradient" color="blue-gray"
                        className="p-4 mb-4 text-center">
                <Typography variant="h5">
                    {t("generic_label.all_uszoversenyek")}
                </Typography>
            </CardHeader>
            <CardBody>
                <DataTable dataList={uszoversenyek}
                           propertyNameOverride={{
                               nev: t("generic_label.name"),
                               datum: t("generic_label.date"),
                               helyszin: t("generic_label.location")
                           }}
                           excludedProperties={["id", "nyitott"]}
                           actionColumn={actionColumn}/>
            </CardBody>
            <CardFooter>
                <Button color="blue-gray" variant="outlined" onClick={() => {
                    setSearchParams({modal: "create"});
                }}>
                    {t("actions.uszoverseny.create")}
                </Button>
            </CardFooter>
        </Card>
    );
}

function NewUszoversenyModal() {
    const t = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const createUszoverseny = useCreateUszoverseny();

    const [nev, setNev] = useState("");
    const [helyszin, setHelyszin] = useState("");
    const [datum, setDatum] = useState(Date.now());

    const open = useMemo(() => {
        return searchParams.has("modal") && searchParams.get("modal") === "create";
    }, [searchParams]);

    const setOpen = useCallback((open: boolean) => {
        setSearchParams(state => {
            if (open) state.set("modal", "create");
            else state.delete("modal");

            return state;
        });
    }, [setSearchParams]);

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
                setOpen(false);
            }).catch(console.error);
        }
    }, [nev, helyszin, createUszoverseny, datum, setOpen]);

    return (
        <Dialog open={open} handler={setOpen}>
            <Card>
                <CardHeader variant="gradient" color="blue-gray"
                            className="p-4 mb-4 text-center
                            flex flex-row items-baseline justify-center gap-4">
                    <PlusIcon className="w-8"/>
                    <Typography variant="h5">
                        {t("actions.uszoverseny.create")}
                    </Typography>
                </CardHeader>
                <CardBody className="flex flex-col gap-2">
                    <Input value={nev} onChange={event => {
                        setNev(event.currentTarget.value);
                    }} label={t("generic_label.name")}/>
                    <Input value={helyszin} onChange={event => {
                        setHelyszin(event.currentTarget.value);
                    }} label={t("generic_label.city")}/>
                    <DateInput value={datum} onValue={setDatum} min={Date.now()}/>
                </CardBody>
                <CardFooter className="flex flex-row gap-2">
                    <Button color="blue-gray" variant="outlined" fullWidth
                            onClick={() => setOpen(false)}>
                        {t("generic_label.rather_not")}
                    </Button>
                    <Button color="blue-gray" variant="filled" fullWidth onClick={doComplete}
                            disabled={!canComplete}>
                        {t("generic_label.lets_go")}
                    </Button>
                </CardFooter>
            </Card>
        </Dialog>
    );
}

import {Link, useSearchParams} from "react-router-dom";
import {Fragment, useCallback, useMemo, useState} from "react";
import {DataTable, DataTableDataColumn} from "../components/tables";
import {DateInput} from "../components/inputs/DateInput";
import {useTranslation} from "../hooks/translations";
import {DestructiveButton} from "../components/buttons";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    Dialog,
    Input,
    Spinner,
    Typography
} from "@material-tailwind/react";
import {PlusIcon} from "@heroicons/react/24/solid";
import {DataTableActionColumn} from "../components/tables/DataTableActionColumn";
import {DateChip} from "../components/DateChip";
import {createUszoverseny} from "../api/uszoversenyek";
import {useSetAdminLayoutTitle} from "../hooks";
import {useNyitottVerseny} from "../hooks/nyitottVerseny";
import {useUszoversenyekList} from "../hooks/uszoversenyek";

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
            <CardBody className="flex flex-col gap-2">
                <Typography variant="lead">{nyitottVerseny.nev}</Typography>
                <div className="flex flex-row gap-2">
                    <DateChip date={nyitottVerseny.datum}/>
                    <Chip value={nyitottVerseny.helyszin} color="teal" variant="ghost"/>
                </div>
            </CardBody>
            <CardFooter className="flex flex-row gap-2">
                <DestructiveButton className="max-w-xs" fullWidth
                                   confirmText={t("actions.uszoverseny.close")}>
                    {t("actions.uszoverseny.close")}
                </DestructiveButton>
                <Link to={String(nyitottVerseny.id)} className="w-full">
                    <Button color="blue" variant="outlined" className="max-w-xs" fullWidth>
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
                <DataTable dataList={uszoversenyek} excludedProperties={["id"]}>
                    <DataTableDataColumn list={uszoversenyek} forKey="nev"
                                         header={t("generic_label.name")} element={name => (
                        <Typography variant="small" className="font-medium">
                            {name}
                        </Typography>
                    )}/>
                    <DataTableDataColumn list={uszoversenyek} forKey="datum"
                                         header={t("generic_label.date")} element={date => (
                        <DateChip date={date}/>
                    )}/>
                    <DataTableDataColumn list={uszoversenyek} forKey="helyszin"
                                         header={t("generic_label.location")} element={location => (
                        <Typography variant="small" className="font-normal">
                            {location}
                        </Typography>
                    )}/>
                    <DataTableDataColumn list={uszoversenyek} forKey="nyitott"
                                         header={t("uszoverseny.state")} element={nyitott => (
                        <Chip value={nyitott ?
                            t("uszoverseny.state.open") :
                            t("uszoverseny.state.closed")}
                              variant="ghost" color={nyitott ? "teal" : "amber"}
                              className="w-min"/>
                    )}/>
                    <DataTableActionColumn list={uszoversenyek} element={entry => (
                        <Link to={String(entry.id)} relative="path">
                            <Button variant="text" color="blue-gray">
                                {t("actions.generic.edit")}
                            </Button>
                        </Link>
                    )}/>
                </DataTable>
            </CardBody>
            <CardFooter>
                <Button color="blue" variant="outlined" onClick={() => {
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
    }, [nev, helyszin, datum, setOpen]);

    return (
        <Dialog open={open} handler={setOpen}>
            <Card>
                <CardHeader variant="gradient" color="blue-gray"
                            className="p-4 mb-4 text-center
                            flex flex-row items-center justify-center gap-2">
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

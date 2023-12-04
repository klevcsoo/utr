import {Link, useSearchParams} from "react-router-dom";
import {Fragment, useCallback, useMemo, useState} from "react";
import {DataTable, DataTableDataColumn} from "../../utils/components/data-table";
import {DateInput} from "../../utils/components/inputs/DateInput";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    Dialog,
    Input,
    Typography
} from "@material-tailwind/react";
import {PlusIcon} from "@heroicons/react/24/solid";
import {DataTableActionColumn} from "../../utils/components/data-table/DataTableActionColumn";
import {DateChip} from "../../utils/components/DateChip";
import {useCreateUszoverseny} from "../hooks";
import {useTranslation} from "../../translations/hooks";
import {useOrganisationFromContext} from "../../organisation/hooks";

export function UszoversenyekIndexPage() {
    return (
        <Fragment>
            <div className="w-full flex flex-col gap-4 items-start">
                <NyitottUszoversenyCard/>
                <UszoversenyekList/>
            </div>
            <NewUszoversenyModal/>
        </Fragment>
    );
}

function NyitottUszoversenyCard() {
    const t = useTranslation();

    const {nyitottUszoverseny: nyitottVerseny} = useOrganisationFromContext();

    return !nyitottVerseny ? null : (
        <Card>
            <CardHeader>
                <Typography variant="h5">{t("uszoverseny.opened")}</Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-2">
                <Typography variant="lead">{nyitottVerseny.nev}</Typography>
                <div className="flex flex-row gap-2">
                    <DateChip date={nyitottVerseny.datum}/>
                    <Chip value={nyitottVerseny.helyszin} color="teal"/>
                </div>
            </CardBody>
            <CardFooter className="flex flex-row gap-2">
                <Link to={String(nyitottVerseny.id)} className="min-w-max max-w-xs w-full">
                    <Button className="max-w-xs" fullWidth>
                        {t("actions.generic.view_details")}
                    </Button>
                </Link>
                <Button className="max-w-xs" fullWidth color="red" variant="text">
                    {t("actions.uszoverseny.close")}
                </Button>
            </CardFooter>
        </Card>
    );
}

function UszoversenyekList() {
    const t = useTranslation();
    const [, setSearchParams] = useSearchParams();

    const {uszoversenyek} = useOrganisationFromContext();

    return (
        <Card>
            <CardHeader>
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
                              color={nyitott ? "teal" : "amber"}/>
                    )}/>
                    <DataTableActionColumn list={uszoversenyek} element={entry => (
                        <Link to={String(entry.id)} relative="path">
                            <Button variant="text" color="gray">
                                {t("actions.generic.edit")}
                            </Button>
                        </Link>
                    )}/>
                </DataTable>
            </CardBody>
            <CardFooter>
                <Button variant="text" onClick={() => {
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
                <CardHeader className="flex flex-row items-center justify-center gap-2">
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
                    <DateInput value={datum} onValue={setDatum} min={Date.now()}
                               label={t("generic_label.date")}/>
                </CardBody>
                <CardFooter className="flex flex-row gap-2">
                    <Button variant="text" fullWidth
                            onClick={() => setOpen(false)}>
                        {t("generic_label.rather_not")}
                    </Button>
                    <Button variant="filled" fullWidth onClick={doComplete}
                            disabled={!canComplete}>
                        {t("generic_label.lets_go")}
                    </Button>
                </CardFooter>
            </Card>
        </Dialog>
    );
}

import {Link, useLocation} from "react-router-dom";
import {AppLogo} from "../components/icons/AppLogo";
import {useAuthUser} from "../hooks/auth/useAuthUser";
import {Fragment, ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {RawMaterialIcon} from "../components/icons/RawMaterialIcon";
import {useAuthLogout} from "../hooks/auth/useAuthLogout";
import {useTranslation} from "../hooks/translations/useTranslation";
import {useSetLocale} from "../hooks/translations/useSetLocale";
import {Locale} from "../types/Locale";
import {GenericSelect} from "../components/selects";
import {Button, Card, CardBody, CardFooter} from "@material-tailwind/react";
import {
    CalendarDaysIcon,
    CogIcon,
    LifebuoyIcon,
    PrinterIcon,
    UserGroupIcon
} from "@heroicons/react/24/solid";
import {packageVersion} from "../lib/config";

export function NavbarLayout() {
    const user = useAuthUser();
    const logout = useAuthLogout();
    const t = useTranslation();

    const doLogout = useCallback(() => {
        if (window.confirm(t("confirm.generic.delete"))) {
            logout().then(() => {
                console.log(t("generic_label.logged_out"));
            });
        }
    }, [logout, t]);

    return (
        <Fragment>
            <Card className="overflow-hidden flex flex-col">
                <div className="grid place-content-center w-full flex-grow">
                    <AppLogo className="h-12"/>
                </div>
                <EnvironmentBanner/>
            </Card>
            <Card className="flex flex-col justify-between">
                <CardBody className="flex flex-col items-start gap-2">
                    <NavbarNavButton text={t("navbar.uszoversenyek")}
                                     to="/admin/uszoversenyek">
                        <CalendarDaysIcon className="w-8"/>
                    </NavbarNavButton>
                    <NavbarNavButton text={t("navbar.csapatok")}
                                     to="/admin/csapatok">
                        <UserGroupIcon className="w-8"/>
                    </NavbarNavButton>
                    <NavbarNavButton text={t("navbar.print")}
                                     to="/admin/nyomtatas">
                        <PrinterIcon className="w-8"/>
                    </NavbarNavButton>
                    <NavbarNavButton text={t("navbar.settings")}
                                     to="/admin/settings">
                        <CogIcon className="w-8"/>
                    </NavbarNavButton>
                </CardBody>
                <CardFooter>
                    <NavbarNavButton text={t("navbar.support")}
                                     to="/admin/support">
                        <LifebuoyIcon className="w-8"/>
                    </NavbarNavButton>
                    <LanguageSelector/>
                    <div className="w-full border-t-2 border-slate-300 my-2"></div>
                    <div className="w-full flex flex-row gap-4
                    items-center justify-between">
                        <h3 className="pl-2">{user?.displayName}</h3>
                        <button type="button" className="grid place-content-center
                    text-red-500 hover:bg-red-200 p-2 rounded-md" onClick={doLogout}>
                            <RawMaterialIcon name="logout"/>
                        </button>
                    </div>
                </CardFooter>
            </Card>
        </Fragment>
    );
}

function EnvironmentBanner() {
    const t = useTranslation();

    const devEnv = useMemo<boolean>(() => {
        return window.location.hostname === "localhost";
    }, []);

    const preRelease = useMemo(() => {
        return !!(packageVersion?.endsWith("alpha") ||
            packageVersion?.endsWith("beta") ||
            packageVersion?.endsWith("RC"));
    }, []);

    return !devEnv && !preRelease ? null : (
        <div
            className={`rounded-b-xl h-8
            ${devEnv ? "bg-red-500" : "bg-amber-500"}\
            flex flex-row gap-2 justify-center items-center\
            ${devEnv ? "text-white" : "text-black"} text-sm`}>
            {devEnv ? <p className="text-inherit">
                {t("generic_label.developer.developer_environment")}
            </p> : null}
            {preRelease ? <p className="text-inherit">
                {t("generic_label.developer.pre_release")}
            </p> : null}
            <p className="text-inherit">
                {packageVersion ?? t("generic_label.unknown")}
            </p>
        </div>
    );
}

function NavbarNavButton(props: {
    text: string
    to: string
    children: ReactNode
}) {
    const {pathname} = useLocation();

    const isActive = useMemo(() => {
        return pathname.startsWith(props.to);
    }, [pathname, props.to]);

    return (
        <Link to={props.to} className="w-full">
            <Button variant={isActive ? "filled" : "text"}
                    color="blue-gray" fullWidth
                    className="flex flex-row gap-4 items-center">
                {props.children}
                {props.text}
            </Button>
        </Link>
    );
}

function LanguageSelector() {
    const t = useTranslation();
    const setLocale = useSetLocale();

    const [selectedLocale, setSelectedLocale] = useState<Locale>(
        window.localStorage.getItem("locale") as Locale ?? "hu"
    );

    const languageOptions = useMemo<{ [key in Locale]: string }>(() => {
        return {
            hu: `🇭🇺 ${t("language.hungarian")}`,
            en: `🇬🇧 ${t("language.english")}`
        };
    }, [t]);

    useEffect(() => {
        setLocale(selectedLocale);
    }, [selectedLocale, setLocale]);

    return (
        <div className={`
            w-full h-10 px-4 py-1 rounded-md text-center
            flex flex-row items-center gap-4 text-inherit
            justify-between
            `}>
            <div className="flex flex-row gap-4 items-center">
                <RawMaterialIcon name="language"/>
            </div>
            <div>
                <GenericSelect options={languageOptions} selected={selectedLocale}
                               label={t("generic_label.language")}
                               onSelect={id => {
                                   setSelectedLocale(id as Locale);
                               }}/>
            </div>
        </div>
    );
}

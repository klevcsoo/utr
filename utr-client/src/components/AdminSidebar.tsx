import {Link, useLocation} from "react-router-dom";
import {useAuthUser} from "../hooks/auth/useAuthUser";
import {ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {RawMaterialIcon} from "./icons/RawMaterialIcon";
import {useAuthLogout} from "../hooks/auth/useAuthLogout";
import {useTranslation} from "../hooks/translations/useTranslation";
import {useSetLocale} from "../hooks/translations/useSetLocale";
import {Locale} from "../types/Locale";
import {GenericSelect} from "./selects";
import {Button, Card, CardBody, CardFooter} from "@material-tailwind/react";
import {
    CalendarDaysIcon,
    CogIcon,
    LifebuoyIcon,
    PrinterIcon,
    UserGroupIcon
} from "@heroicons/react/24/solid";

export function AdminSidebar() {
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

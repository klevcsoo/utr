import {Link, useLocation} from "react-router-dom";
import {createElement, FunctionComponent, useEffect, useMemo, useState} from "react";
import {useTranslation} from "../hooks/translations/useTranslation";
import {useSetLocale} from "../hooks/translations/useSetLocale";
import {Locale} from "../types/Locale";
import {GenericSelect} from "./selects";
import {
    Card,
    CardBody,
    CardFooter,
    List,
    ListItem,
    ListItemPrefix,
    Typography
} from "@material-tailwind/react";
import {
    CalendarDaysIcon,
    CogIcon,
    LifebuoyIcon,
    PrinterIcon,
    UserGroupIcon
} from "@heroicons/react/24/solid";

export function AdminSidebar() {
    const t = useTranslation();

    const navigationList = useMemo<{
        icon: FunctionComponent,
        title: string
        redirect: string
    }[]>(() => {
        return [
            {
                icon: CalendarDaysIcon,
                title: t("navigation.sidebar.competitions"),
                redirect: "/admin/uszoversenyek"
            },
            {
                icon: UserGroupIcon,
                title: t("navigation.sidebar.teams"),
                redirect: "/admin/csapatok"
            },
            {
                icon: PrinterIcon,
                title: t("navigation.sidebar.print"),
                redirect: "/admin/print"
            },
            {
                icon: CogIcon,
                title: t("navigation.sidebar.settings"),
                redirect: "/admin/settings"
            },
            {
                icon: LifebuoyIcon,
                title: t("navigation.sidebar.support"),
                redirect: "/admin/support"
            }
        ];
    }, [t]);

    return (
        <Card className="w-full justify-between">
            <CardBody className="px-0">
                <div className="px-6">
                    <Typography variant="h4" color="blue"
                                className="font-display">
                        {t("generic_label.navigation")}
                    </Typography>
                </div>
                <hr className="mx-6 my-4 border-blue-gray-50"/>
                <List className="px-0">
                    {navigationList.map((entry, index) => (
                        <NavButton key={index} {...entry}/>
                    ))}
                </List>
            </CardBody>
            <CardFooter>
                <hr className="mb-5 border-blue-gray-50"/>
                <LanguageSelector/>
            </CardFooter>
        </Card>
    );
}

function NavButton(props: {
    icon: FunctionComponent,
    title: string
    redirect: string
}) {
    const {pathname} = useLocation();

    const isActive = useMemo(() => {
        return pathname.startsWith(props.redirect);
    }, [pathname, props.redirect]);

    return (
        <Link to={props.redirect}
              className={`px-6 border-l-4 ${isActive ?
                  "border-blue-400" :
                  "border-transparent"
              }`}>
            <ListItem className={isActive ? "bg-blue-50" : "bg-transparent"}>
                <ListItemPrefix>
                    {createElement<{ className: string }>(props.icon, {className: "h-6"})}
                </ListItemPrefix>
                <Typography className="font-medium" variant="small">
                    {props.title}
                </Typography>
            </ListItem>
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
        <GenericSelect options={languageOptions} selected={selectedLocale}
                       label={t("generic_label.language")}
                       onSelect={id => {
                           setSelectedLocale(id as Locale);
                       }}/>
    );
}

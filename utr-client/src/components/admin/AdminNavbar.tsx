import {
    Avatar,
    Badge,
    Button,
    Menu,
    MenuHandler,
    MenuList,
    Navbar,
    Typography
} from "@material-tailwind/react";
import {AppLogo} from "../icons/AppLogo";
import {Link, useLocation} from "react-router-dom";
import {createElement, FunctionComponent, useMemo, useState} from "react";
import {
    ArrowRightOnRectangleIcon,
    ChevronDownIcon,
    CubeTransparentIcon,
    TableCellsIcon
} from "@heroicons/react/24/solid";
import {AdminBreadcrumbs} from "./AdminBreadcrumbs";
import {useAuthLogout} from "../../auth/hooks";
import {useNyitottVerseny} from "../../uszoversenyek/hooks";
import {useTranslation} from "../../translations/hooks";

export function AdminNavbar() {
    const t = useTranslation();

    return (
        <Navbar blurred shadow
                className="p-1 max-w-screen-3xl flex flex-col justify-between">
            <div className="px-8 flex flex-row justify-between items-center">
                <div className="flex flex-row items-center">
                    <AppLogo className="h-12"/>
                </div>
                <div className="flex flex-row gap-8 items-center">
                    <NavButton text={t("navigation.admin_layout")}
                               to="/admin" icon={TableCellsIcon}/>
                    <NavButton text={t("navigation.live_view")}
                               to="/live" icon={CubeTransparentIcon}
                               nyitottVersenyBadge/>
                </div>
                <UserMenu/>
            </div>
            <AdminBreadcrumbs/>
        </Navbar>
    );
}

function NavButton(props: {
    to: string
    text: string
    icon: FunctionComponent
    nyitottVersenyBadge?: boolean
}) {
    const {pathname} = useLocation();
    const [nyitottVerseny] = useNyitottVerseny();

    const isActive = useMemo(() => {
        return pathname.startsWith(props.to);
    }, [pathname, props.to]);

    const badge = useMemo(() => {
        return props.nyitottVersenyBadge && !!nyitottVerseny;
    }, [nyitottVerseny, props.nyitottVersenyBadge]);

    return (
        <Badge className="animate-pulse" invisible={!badge}>
            <Link to={props.to}>
                <Typography as="div" variant="small" color={isActive ? "blue" : "blue-gray"}
                            className={`font-normal px-4 py-2 rounded-lg 
                        ${isActive ?
                                "bg-blue-gray-50 bg-opacity-50 border border-blue-gray-100" :
                                "bg-transparent hover:bg-gray-100"}
                        flex flex-row items-center gap-2`}>
                    {createElement<{ className: string }>(props.icon, {
                        className: "w-6 mb-0.5"
                    })}
                    {props.text}
                </Typography>
            </Link>
        </Badge>
    );
}

function UserMenu() {
    const t = useTranslation();
    const logout = useAuthLogout();

    const [open, setOpen] = useState(false);

    return (
        <Menu open={open} handler={setOpen}>
            <MenuHandler>
                <Button variant="text" color="blue-gray"
                        className="flex flex-row items-center gap-2 p-1 rounded-full">
                    <Avatar src="/user_avatar.png" withBorder className="p-0.5" size="sm"/>
                    <ChevronDownIcon
                        className={`h-4 w-4 transition-transform ${
                            open ? "rotate-180" : ""
                        }`}
                    />
                </Button>
            </MenuHandler>
            <MenuList>
                <Button variant="text" color="red"
                        className="flex flex-row items-center gap-2"
                        onClick={logout}>
                    <ArrowRightOnRectangleIcon className="h-6"/>
                    {t("actions.logout")}
                </Button>
            </MenuList>
        </Menu>
    );
}

import {NavLink} from "react-router-dom";
import {AppLogo} from "../components/icons/AppLogo";
import {useAuthUser} from "../hooks/auth/useAuthUser";
import {useCallback} from "react";
import {RawMaterialIcon} from "../components/icons/RawMaterialIcon";
import {useAuthLogout} from "../hooks/auth/useAuthLogout";
import {useTranslation} from "../hooks/translations/useTranslation";

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
        <div className="w-full h-full bg-slate-200 text-white
        flex flex-col items-start gap-4 p-4 justify-between">
            <div className="flex flex-col items-start gap-2 w-full">
                <AppLogo className="m-4"/>
                <NavbarNavButton icon="event" text={t("navbar.uszoversenyek")!}
                                 to="/admin/uszoversenyek"/>
                <NavbarNavButton icon="groups" text={t("navbar.csapatok")!}
                                 to="/admin/csapatok"/>
                <NavbarNavButton icon="print" text={t("navbar.print")!}
                                 to="/admin/nyomtatas"/>
                <NavbarNavButton icon="settings" text={t("navbar.settings")!}
                                 to="/admin/settings"/>
            </div>
            <div className="flex flex-col items-start gap-2 w-full">
                <NavbarNavButton icon="support" text={t("navbar.support")!}
                                 to="/admin/support"/>
                <div className="w-full border-t-2 border-slate-300 my-2"></div>
                <div className="w-full flex flex-row gap-4
                items-center justify-between">
                    <h3 className="pl-2">{user?.displayName}</h3>
                    <button type="button" className="grid place-content-center
                    text-red-500 hover:bg-red-200 p-2 rounded-md" onClick={doLogout}>
                        <RawMaterialIcon name="logout"/>
                    </button>
                </div>
            </div>
        </div>
    );
}

function NavbarNavButton(props: {
    icon: string
    text: string
    to: string
}) {
    return (
        <NavLink to={props.to} className={({isActive}) => `
            w-full h-10 px-4 py-1 rounded-md text-center
            flex flex-row items-center gap-4 text-inherit
            ${isActive ? "bg-white" :
            "bg-transparent hover:bg-slate-100"}
        `}>
            <RawMaterialIcon name={props.icon}/>
            {props.text}
        </NavLink>
    );
}

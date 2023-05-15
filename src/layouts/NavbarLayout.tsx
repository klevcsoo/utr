import {NavLink} from "react-router-dom";
import {AppLogo} from "../components/AppLogo";
import {useAuthUser} from "../hooks/useAuthUser";
import {useCallback} from "react";

export function NavbarLayout() {
    const {user, logout} = useAuthUser();

    const doLogout = useCallback(() => {
        if (window.confirm("Biztos ki szeretnél jelentkezni?")) {
            logout().then(() => {
                console.log("Kijelentkezve.");
            });
        }
    }, [logout]);

    return (
        <div className="w-full h-full bg-slate-200 text-white
        flex flex-col items-start gap-4 p-4 justify-between">
            <div className="flex flex-col items-start gap-2 w-full">
                <AppLogo className="m-4"/>
                <NavbarNavButton icon="event" text="Versenyek"
                                 to="/overview/versenyek"/>
                <NavbarNavButton icon="groups" text="Csapatok"
                                 to="/overview/csapatok"/>
                <NavbarNavButton icon="print" text="Nyomtatás"
                                 to="/overview/nyomtatas"/>
                <NavbarNavButton icon="settings" text="Beállítások"
                                 to="/overview/settings"/>
            </div>
            <div className="flex flex-col items-start gap-2 w-full">
                <NavbarNavButton icon="support" text="Támogatás" to="/support"/>
                <div className="w-full border-t-2 border-slate-300 my-2"></div>
                <div className="w-full flex flex-row gap-4
                items-center justify-between">
                    <h3 className="pl-2">{user?.displayName}</h3>
                    <button type="button" className="grid place-content-center
                    text-red-500 hover:bg-red-200 p-2 rounded-md" onClick={doLogout}>
                        <span className="material-symbols-rounded text-inherit">
                            logout
                        </span>
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
            <span className="material-symbols-rounded text-inherit">
                {props.icon}
            </span>
            {props.text}
        </NavLink>
    );
}

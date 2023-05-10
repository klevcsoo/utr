import {useAuthUser} from "../hooks/useAuthUser";
import {NavLink} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";

export function HeaderLayout() {
    return (
        <div className="h-16 px-8 absolute inset-0 z-40 bg-white shadow-xl
        flex flex-row gap-8 justify-between items-center">
            <div className="flex flex-row gap-8 items-center">
                <h1 className="text-4xl"><b>UTR</b></h1>
                <div className="grid grid-cols-3 grid-rows-1 place-items-center gap-4">
                    <HeaderNavLink to="/" text="Nyitott verseny"/>
                    <HeaderNavLink to="/overview" text="Áttekintés"/>
                    <HeaderNavLink to="/settings" text="Beállítások"/>
                </div>
            </div>
            <HeaderLogoutButton/>
        </div>
    );
}

function HeaderNavLink(props: {
    to: string
    text: string
}) {
    return (
        <NavLink to={props.to} className={({isActive}) => `
            w-full px-2 py-1 rounded-md text-center
            ${isActive ? "bg-blue-100 text-blue-500" :
            "bg-white text-inherit hover:bg-neutral-100"}
        `}>
            {props.text}
        </NavLink>
    );
}

function HeaderLogoutButton() {
    const {logout} = useAuthUser();
    const [open, setOpen] = useState(false);

    const doLogout = useCallback(() => {
        if (open) {
            logout();
        } else {
            setOpen(true);
        }
    }, [logout, open]);

    useEffect(() => {
        if (open) {
            const id = setTimeout(() => setOpen(false), 2500);
            return () => clearTimeout(id);
        }
    }, [open]);

    return (
        <button type="button" onClick={doLogout}
                className="group flex flex-row gap-2 items-center
                p-2 rounded-md hover:bg-red-100">
            <span className="material-symbols-rounded
                text-inherit group-hover:text-red-500">
                logout
            </span>
            {open ? (
                <p className="text-inherit group-hover:text-red-500">
                    Kijelentkezés
                </p>
            ) : null}
        </button>
    );
}

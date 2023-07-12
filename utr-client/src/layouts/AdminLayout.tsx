import {NavbarLayout} from "./NavbarLayout";
import {Link, Outlet} from "react-router-dom";
import React, {createContext, useCallback, useState} from "react";
import {RawMaterialIcon} from "../components/icons/RawMaterialIcon";
import {useTranslation} from "../hooks/translations/useTranslation";

export const AdminLayoutTitleContext = createContext<
    (title: string, disableNavigation?: boolean) => void
>(
    () => {
    }
);

export function AdminLayout() {
    const t = useTranslation();
    const [title, setTitle] = useState(t("title.admin_layout.overview"));
    const [navigationDisabled, setNavigationDisabled] = useState(false);

    const doChange = useCallback((title: string, disableNavigation?: boolean) => {
        setTitle(title);
        setNavigationDisabled(!!disableNavigation);
    }, []);

    return (
        <div className="grid grid-cols-[20rem_auto]
                        w-screen h-screen overflow-hidden">
            <NavbarLayout/>
            <div className={"w-full h-full p-8 flex flex-col items-start gap-4 " +
                "overflow-x-hidden overflow-y-scroll" +
                (navigationDisabled ? " pointer-events-none" : "")}>
                <Link to=".." relative="path"
                      className="flex flex-row gap-1 group
                      items-center justify-start">
                    {!navigationDisabled ? (
                        <RawMaterialIcon name="arrow_back_ios" className="scale-150"/>
                    ) : null}
                    <h1 className="group-hover:underline">
                        <b>{title}</b>
                    </h1>
                </Link>
                <AdminLayoutTitleContext.Provider value={doChange}>
                    <Outlet/>
                </AdminLayoutTitleContext.Provider>
            </div>
        </div>
    );
}

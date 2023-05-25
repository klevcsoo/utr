import {NavbarLayout} from "./NavbarLayout";
import {Link, Outlet} from "react-router-dom";
import React, {createContext, useState} from "react";
import {RawMaterialIcon} from "../components/icons/RawMaterialIcon";

export const AdminLayoutTitleContext = createContext<(title: string) => void>(
    () => {
    }
);

export function AdminLayout() {
    const [title, setTitle] = useState("Áttekintés");

    return (
        <div className="grid grid-cols-[20rem_auto]
                        w-screen h-screen overflow-hidden">
            <NavbarLayout/>
            <div className="w-full h-full p-8 flex flex-col items-start gap-4
                            overflow-x-hidden overflow-y-scroll">
                <Link to=".." relative="path"
                      className="flex flex-row gap-1 group
                      items-center justify-start">
                    <RawMaterialIcon name="arrow_back_ios" className="scale-150"/>
                    <h1 className="group-hover:underline">
                        <b>{title}</b>
                    </h1>
                </Link>
                <AdminLayoutTitleContext.Provider value={setTitle}>
                    <Outlet/>
                </AdminLayoutTitleContext.Provider>
            </div>
        </div>
    );
}

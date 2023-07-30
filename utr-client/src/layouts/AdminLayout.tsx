import {AdminSidebar} from "../components/AdminSidebar";
import {Outlet} from "react-router-dom";
import React, {createContext, useState} from "react";
import {AdminNavbar} from "../components/AdminNavbar";

export const AdminLayoutTitleContext = createContext<
    (title: string, disableNavigation?: boolean) => void
>(
    () => {
    }
);

export function AdminLayout() {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className={`grid ${expanded ? "grid-cols-[20rem_auto]" : "grid-cols-[4rem_auto]"}
            grid-rows-[4rem_calc(100vh_-_7rem)_auto] gap-4 p-4 w-screen transition-all`}>
            <div className="col-start-1 col-span-full row-start-1
            flex flex-grow justify-center sticky top-4 z-50">
                <AdminNavbar/>
            </div>
            <div className="col-start-1 col-end-1 row-start-2 row-end-2 flex flex-grow
            sticky top-24 z-40">
                <AdminSidebar expanded={expanded}
                              toggleExpanded={() => {
                                  setExpanded(prevState => !prevState);
                              }}/>
            </div>
            <div className="col-start-2 col-end-2 row-start-2 row-span-full">
                <Outlet/>
            </div>
        </div>
    );
}

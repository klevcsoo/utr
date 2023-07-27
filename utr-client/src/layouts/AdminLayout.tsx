import {AdminSidebar} from "../components/AdminSidebar";
import {Outlet} from "react-router-dom";
import React, {createContext} from "react";

export const AdminLayoutTitleContext = createContext<
    (title: string, disableNavigation?: boolean) => void
>(
    () => {
    }
);

export function AdminLayout() {
    return (
        <div className="grid grid-cols-[20rem_auto] grid-rows-[6rem_auto] gap-4 p-4
                        w-screen h-screen">
            <AdminSidebar/>
            <div className="col-start-2 row-span-full overflow-scroll">
                <Outlet/>
            </div>
        </div>
    );
}

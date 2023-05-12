import {NavbarLayout} from "./NavbarLayout";
import {Outlet} from "react-router-dom";
import React from "react";

export function AdminLayout() {
	return (
		<div className="grid grid-cols-[20rem_auto]
                        w-screen h-screen overflow-hidden">
			<NavbarLayout/>
			<div className="w-full h-full
                            overflow-x-hidden overflow-y-scroll">
				<Outlet/>
			</div>
		</div>
	);
}

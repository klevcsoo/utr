import {useContext, useEffect} from "react";
import {AdminLayoutTitleContext} from "../layouts/AdminLayout";

export function useSetAdminLayoutTitle(title: string) {
    const setTitle = useContext(AdminLayoutTitleContext);

    useEffect(() => {
        setTitle(title);
    }, [setTitle, title]);
}

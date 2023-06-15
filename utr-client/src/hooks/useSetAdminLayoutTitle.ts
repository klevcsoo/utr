import {useContext, useEffect} from "react";
import {AdminLayoutTitleContext} from "../layouts/AdminLayout";

export function useSetAdminLayoutTitle(title: string, disableNavigation?: boolean) {
    const setTitle = useContext(AdminLayoutTitleContext);

    useEffect(() => {
        setTitle(title, disableNavigation);
    }, [setTitle, title, disableNavigation]);
}

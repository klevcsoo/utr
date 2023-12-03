import {useTranslation} from "../../translations/hooks";
import {useSetAdminLayoutTitle} from "../hooks";
import {Navigate} from "react-router-dom";

export function AdminIndexPage() {
    const t = useTranslation();

    useSetAdminLayoutTitle(t("title.admin_layout.overview"), true);

    return (
        <Navigate to="uszoversenyek" replace/>
    );
}

import {useTranslation} from "../../translations/hooks";
import {useSetAdminLayoutTitle} from "../hooks";

export function AdminIndexPage() {
    const t = useTranslation();

    useSetAdminLayoutTitle(t("title.admin_layout.overview"), true);

    return (
        <div>admin index</div>
    );
}

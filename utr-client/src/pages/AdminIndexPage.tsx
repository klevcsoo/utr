import {useSetAdminLayoutTitle} from "../hooks/useSetAdminLayoutTitle";
import {useTranslation} from "../hooks/translations/useTranslation";

export function AdminIndexPage() {
    const t = useTranslation();

    useSetAdminLayoutTitle(t("title.admin_layout.overview")!, true);

    return (
        <div>admin index</div>
    );
}

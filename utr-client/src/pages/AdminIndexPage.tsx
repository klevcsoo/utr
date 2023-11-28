import {useTranslation} from "../hooks/translations";
import {useSetAdminLayoutTitle} from "../hooks";

export default function AdminIndexPage() {
    const t = useTranslation();

    useSetAdminLayoutTitle(t("title.admin_layout.overview"), true);

    return (
        <div>admin index</div>
    );
}

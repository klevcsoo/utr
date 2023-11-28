import {useSetAdminLayoutTitle} from "../hooks/useSetAdminLayoutTitle";

import {useTranslation} from "../translations/hooks";

export function AdminIndexPage() {
    const t = useTranslation();

    useSetAdminLayoutTitle(t("title.admin_layout.overview"), true);

    return (
        <div>admin index</div>
    );
}

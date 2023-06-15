import {useSetAdminLayoutTitle} from "../../hooks/useSetAdminLayoutTitle";

export function AdminIndexPage() {
    useSetAdminLayoutTitle("Áttekintés", true);

    return (
        <div>admin index</div>
    );
}

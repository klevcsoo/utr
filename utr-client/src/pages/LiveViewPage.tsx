import {useNyitottVerseny} from "../hooks/nyitottVerseny/useNyitottVerseny";
import {useAuthUser} from "../hooks/auth/useAuthUser";
import {Link, NavLink} from "react-router-dom";
import {Fragment} from "react";
import {useTranslation} from "../hooks/translations/useTranslation";
import {Button, Spinner} from "@material-tailwind/react";
import {ACCESS_LEVEL_ADMIN} from "../lib/api/auth";

export function LiveViewPage() {
    const t = useTranslation();
    const [uszoverseny, uszoversenyLoading] = useNyitottVerseny();
    const user = useAuthUser();

    return uszoversenyLoading ? (
        <div className="w-screen h-screen grid place-content-center">
            <Spinner/>
        </div>
    ) : !uszoverseny ? (
        <div className="w-screen h-screen grid place-items-center place-content-center
        gap-4">
            <p>{t("error.page.no_open_uszoverseny")}</p>
            {user?.accessLevel ?? 0 >= ACCESS_LEVEL_ADMIN ? (
                <Link to="/admin/uszoversenyek">
                    <Button color="blue">
                        {t("actions.uszoverseny.continue_to_uszoversenyek")}
                    </Button>
                </Link>
            ) : (
                <Button color="blue">{t("actions.generic.lets_load_again")}</Button>
            )}
        </div>
    ) : (
        <Fragment>
            <div className="p-4 flex flex-col gap-2">
                <h1>{uszoverseny.nev}</h1>
                <div className="flex flex-row gap-2 items-center px-2 text-lg">
                    <p>{uszoverseny.helyszin}</p>
                    <p>·</p>
                    <p><b>{uszoverseny.datum.toDateString()}</b></p>
                </div>
                {user?.accessLevel ?? 0 >= ACCESS_LEVEL_ADMIN ? (
                    <div className="flex flex-row gap-2 items-center px-1 text-lg">
                        <Button color="blue">{t("actions.generic.open")}</Button>
                        <Link to={`/admin/uszoversenyek/${uszoverseny.id}`}>
                            <Button color="blue" variant="outlined">
                                {t("actions.generic.edit")}
                            </Button>
                        </Link>
                    </div>
                ) : null}
                {uszoverseny.versenyszamok.map((value, index) => (
                    <div key={index}>{JSON.stringify(value)}</div>
                ))}
            </div>
            {user?.accessLevel ?? 0 >= ACCESS_LEVEL_ADMIN ? (
                <NavLink to="/admin" className="bottom-4 right-4 fixed">
                    <Button color="blue">{t("generic_label.admin_layout")}</Button>
                </NavLink>
            ) : null}
        </Fragment>
    );
}

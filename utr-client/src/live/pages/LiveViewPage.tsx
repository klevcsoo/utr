import {Link, NavLink} from "react-router-dom";
import {Fragment, useContext} from "react";
import {Button, Spinner} from "@material-tailwind/react";
import {useAuthUser} from "../../auth/hooks";
import {useNyitottVerseny} from "../../uszoversenyek/hooks";
import {useTranslation} from "../../translations/hooks";
import {ArrowRightOnRectangleIcon} from "@heroicons/react/24/solid";
import {AuthContext} from "../../auth/api";

export function LiveViewPage() {
    const t = useTranslation();
    const {logout} = useContext(AuthContext);
    const [uszoverseny, uszoversenyLoading] = useNyitottVerseny();
    const user = useAuthUser();

    return uszoversenyLoading ? (
        <div className="w-screen h-screen grid place-content-center">
            <Spinner/>
        </div>
    ) : !uszoverseny ? (
        <Fragment>
            <Button variant="text" color="red" className="!absolute top-8 right-8
            flex flex-row items-center gap-2" onClick={logout}>
                <ArrowRightOnRectangleIcon className="h-6"/>
                {t("actions.logout")}
            </Button>
            <div className="w-screen h-screen grid place-items-center place-content-center gap-4">
                <p>{t("error.page.no_open_uszoverseny")}</p>
                {user?.roles.includes("admin") ? (
                    <Link to="/admin/uszoversenyek">
                        <Button>
                            {t("actions.uszoverseny.continue_to_uszoversenyek")}
                        </Button>
                    </Link>
                ) : (
                    <Button>{t("actions.generic.lets_load_again")}</Button>
                )}
            </div>
        </Fragment>
    ) : (
        <Fragment>
            <div className="p-4 flex flex-col gap-2">
                <h1>{uszoverseny.nev}</h1>
                <div className="flex flex-row gap-2 items-center px-2 text-lg">
                    <p>{uszoverseny.helyszin}</p>
                    <p>·</p>
                    <p><b>{uszoverseny.datum.toDateString()}</b></p>
                </div>
                {user?.roles.includes("admin") ? (
                    <div className="flex flex-row gap-2 items-center px-1 text-lg">
                        <Button>{t("actions.generic.open")}</Button>
                        <Link to={`/admin/uszoversenyek/${uszoverseny.id}`}>
                            <Button variant="text">
                                {t("actions.generic.edit")}
                            </Button>
                        </Link>
                    </div>
                ) : null}
                {uszoverseny.versenyszamok.map((value, index) => (
                    <div key={index}>{JSON.stringify(value)}</div>
                ))}
            </div>
            {user?.roles.includes("admin") ? (
                <NavLink to="/admin" className="bottom-4 right-4 fixed">
                    <Button>{t("generic_label.admin_layout")}</Button>
                </NavLink>
            ) : null}
        </Fragment>
    );
}

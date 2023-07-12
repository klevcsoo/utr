import {useNyitottVerseny} from "../hooks/nyitottVerseny/useNyitottVerseny";
import {useAuthUser} from "../hooks/auth/useAuthUser";
import {Link, NavLink} from "react-router-dom";
import {PrimaryButton} from "../components/inputs/buttons/PrimaryButton";
import {SecondaryButton} from "../components/inputs/buttons/SecondaryButton";
import {LoadingSpinner} from "../components/LoadingSpinner";
import {Fragment} from "react";
import {useTranslation} from "../hooks/translations/useTranslation";

export function IndexPage() {
    const t = useTranslation();
    const [uszoverseny, uszoversenyLoading] = useNyitottVerseny();
    const user = useAuthUser();

    return uszoversenyLoading ? (
        <div className="w-screen h-screen grid place-content-center">
            <LoadingSpinner/>
        </div>
    ) : !uszoverseny ? (
        <div className="w-screen h-screen grid place-items-center place-content-center
        gap-4">
            <p>{t("error.page.no_open_uszoverseny")}</p>
            {user?.roles.includes("admin") ? (
                <Link to="/admin/uszoversenyek">
                    <PrimaryButton text={t("actions.uszoverseny.continue_to_uszoversenyek")!}/>
                </Link>
            ) : (
                <PrimaryButton text={t("actions.generic.lets_load_again")!}/>
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
                {user?.roles.includes("admin") ? (
                    <div className="flex flex-row gap-2 items-center px-1 text-lg">
                        <PrimaryButton text={t("actions.generic.open")!}/>
                        <Link to={`/admin/uszoversenyek/${uszoverseny.id}`}>
                            <SecondaryButton text={t("actions.generic.edit")!}/>
                        </Link>
                    </div>
                ) : null}
                {uszoverseny.versenyszamok.map((value, index) => (
                    <div key={index}>{JSON.stringify(value)}</div>
                ))}
            </div>
            {user?.roles.includes("admin") ? (
                <NavLink to="/admin" className="bottom-4 right-4 fixed">
                    <PrimaryButton text={t("generic_label.admin_layout")!}/>
                </NavLink>
            ) : null}
        </Fragment>
    );
}

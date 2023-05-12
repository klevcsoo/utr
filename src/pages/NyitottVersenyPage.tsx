import {useNyitottVerseny} from "../hooks/useNyitottVerseny";
import {useAuthUser} from "../hooks/useAuthUser";
import {Link, NavLink} from "react-router-dom";
import {PrimaryButton} from "../components/inputs/PrimaryButton";
import {SecondaryButton} from "../components/inputs/SecondaryButton";
import {LoadingSpinner} from "../components/LoadingSpinner";
import {Fragment} from "react";

export function NyitottVersenyPage() {
    const [uszoverseny, uszoversenyLoading] = useNyitottVerseny();
    const {user} = useAuthUser();

    return uszoversenyLoading ? (
        <div className="w-screen h-screen grid place-content-center">
            <LoadingSpinner scale={50}/>
        </div>
    ) : !uszoverseny ? (
        <div className="w-screen h-screen grid place-items-center place-content-center
        gap-4">
            <p>Úgy látszik, nincs megnyitott úszóverseny.</p>
            {user?.roles.includes("admin") ? (
                <Link to="/overview/versenyek">
                    <PrimaryButton text="Tovább a versenyekhez" onClick={() => {
                    }}/>
                </Link>
            ) : (
                <PrimaryButton text="Nézzük meg újra!" onClick={() => {
                    window.location.reload();
                }}/>
            )}
        </div>
    ) : (
        <Fragment>
            <div className="p-4 flex flex-col gap-2">
                <h1 className="text-5xl font-bold">{uszoverseny.nev}</h1>
                <div className="flex flex-row gap-2 items-center px-2 text-lg">
                    <p>{uszoverseny.helyszin}</p>
                    <p>·</p>
                    <p><b>{uszoverseny.datum.toDateString()}</b></p>
                </div>
                {user?.roles.includes("admin") ? (
                    <div className="flex flex-row gap-2 items-center px-1 text-lg">
                        <PrimaryButton text="Megnyitás" onClick={() => {
                        }}/>
                        <Link to={`/overview/versenyek/${uszoverseny.id}`}>
                            <SecondaryButton text="Szerkesztés" onClick={() => {
                            }}/>
                        </Link>
                    </div>
                ) : null}
                {uszoverseny.versenyszamok.map((value, index) => (
                    <div key={index}>{JSON.stringify(value)}</div>
                ))}
            </div>
            {user?.roles.includes("admin") ? (
                <NavLink to="/overview/csapatok" className="bottom-4 right-4 fixed">
                    <PrimaryButton text="Admin felület" onClick={() => {
                    }}/>
                </NavLink>
            ) : null}
        </Fragment>
    );
}

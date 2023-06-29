import {SecondaryButton} from "../components/inputs/buttons/SecondaryButton";
import {useNavigate} from "react-router-dom";

export function Error404Page() {
    const navigate = useNavigate();

    return (
        <div className="w-screen h-screen grid place-content-center gap-8">
            <div className="select-none">
                <h1 className="text-slate-300 text-9xl text-center">404</h1>
                <h2 className="text-center">Úgy látszik, nincs ilyen oldal.</h2>
            </div>
            <SecondaryButton text="Vissza az előző oldalra" onClick={() => {
                navigate(-1);
            }}/>
        </div>
    );
}

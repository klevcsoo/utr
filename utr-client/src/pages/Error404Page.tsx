import {useNavigate} from "react-router-dom";
import {useTranslation} from "../hooks/translations/useTranslation";
import {Button} from "@material-tailwind/react";

export function Error404Page() {
    const t = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="w-screen h-screen grid place-content-center gap-8">
            <div className="select-none">
                <h1 className="text-slate-300 text-9xl text-center">404</h1>
                <h2 className="text-center">{t("error.page.not_found.title")}</h2>
            </div>
            <Button color="blue-gray" variant="outlined" onClick={() => navigate(-1)}>
                {t("error.page.not_found.button")}
            </Button>
        </div>
    );
}

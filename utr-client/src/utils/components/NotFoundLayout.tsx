import {useLocation, useNavigate} from "react-router-dom";
import {Button, Typography} from "@material-tailwind/react";
import {useTranslation} from "../../translations/hooks";

export function NotFoundLayout() {
    const t = useTranslation();
    const navigate = useNavigate();
    const {pathname} = useLocation();

    return (
        <div className="w-full h-full grid place-content-center gap-8">
            <div className="select-none">
                <Typography variant="h1" className="font-bold text-center">
                    404
                </Typography>
                <Typography>
                    {t("error.object.not_found.title", pathname.split("/").slice(-1)[0])}
                </Typography>
            </div>
            <Button variant="text" onClick={() => navigate(-1)}>
                {t("error.page.not_found.button")}
            </Button>
        </div>
    );
}

import {useCallback, useContext, useMemo, useState} from "react";
import {TextInput} from "../components/inputs/TextInput";
import {AuthContext} from "../api/auth";
import {AppLogo} from "../components/icons/AppLogo";
import {useTranslation} from "../hooks/translations/useTranslation";
import {Button} from "@material-tailwind/react";

export function LoginPage() {
    const t = useTranslation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {login} = useContext(AuthContext);

    const canLogin = useMemo(() => {
        return !!username && !!password;
    }, [username, password]);

    const doLogin = useCallback(() => {
        if (canLogin) {
            login(username, password).then(u => console.log(u));
        }
    }, [canLogin, login, username, password]);

    return (
        <div className="w-screen h-screen grid place-content-center">
            <div className="flex flex-col gap-4 items-center">
                <AppLogo/>
                <TextInput value={username} onValue={setUsername}
                           placeholder={t("generic_label.username")}
                           onSubmit={doLogin}/>
                <TextInput value={password} onValue={setPassword}
                           placeholder={t("generic_label.password")} password
                           onSubmit={doLogin}/>
                <Button color="blue" onClick={doLogin} disabled={!canLogin}>
                    {t("actions.generic.login")}
                </Button>
            </div>
        </div>
    );
}

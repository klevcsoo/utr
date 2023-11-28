import {Fragment, useCallback, useContext, useMemo, useState} from "react";
import {TextInput} from "../../utils/components/inputs/TextInput";
import {AuthContext} from "../api";
import {AppLogo} from "../../utils/components/icons/AppLogo";
import {Button, Card, CardBody, CardFooter, CardHeader, Spinner} from "@material-tailwind/react";
import {useTranslation} from "../../translations/hooks";

export function LoginPage() {
    const t = useTranslation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {login} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const canLogin = useMemo(() => {
        return !!username && !!password;
    }, [username, password]);

    const doLogin = useCallback(() => {
        if (canLogin) {
            setLoading(true);
            setTimeout(() => {
                login(username, password)
                    .then(console.log)
                    .catch(console.error)
                    .finally(() => setLoading(false));
            }, 2000);
        }
    }, [canLogin, login, username, password]);

    return (
        <Fragment>
            <div className="fixed inset-0 z-0">
                <img src="/login_bg.jpg" alt="login_bg"
                     className="w-screen h-screen opacity-50"/>
            </div>
            <div className="w-screen h-screen grid place-content-center">
                <Card className="w-80">
                    <CardHeader variant="gradient" color="blue"
                                className="grid place-content-center p-1">
                        <AppLogo className="invert brightness-200" scale={120}/>
                    </CardHeader>
                    <CardBody className="flex flex-col items-center gap-2">
                        <TextInput value={username} onValue={setUsername}
                                   label={t("generic_label.username")}
                                   onSubmit={doLogin}/>
                        <TextInput value={password} onValue={setPassword}
                                   label={t("generic_label.password")} type="password"
                                   onSubmit={doLogin}/>
                    </CardBody>
                    <CardFooter>
                        <Button color="blue" onClick={doLogin} fullWidth
                                disabled={!canLogin || loading}>
                            {loading ? (
                                <div className="grid place-content-center w-full">
                                    <Spinner className="w-4 h-4"/>
                                </div>
                            ) : t("actions.generic.login")}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </Fragment>
    );
}

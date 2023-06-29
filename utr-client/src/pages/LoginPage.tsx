import {useCallback, useContext, useMemo, useState} from "react";
import {TextInput} from "../components/inputs/TextInput";
import {PrimaryButton} from "../components/inputs/buttons/PrimaryButton";
import {AuthContext} from "../api/auth";
import {AppLogo} from "../components/icons/AppLogo";

export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {login} = useContext(AuthContext);

    const canLogin = useMemo(() => {
        const usernames = ["admin", "allitobiro", "idorogzito", "speaker"];
        return usernames.includes(username) && !!password;
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
                           placeholder="Felhasználónév"
                           onSubmit={doLogin}/>
                <TextInput value={password} onValue={setPassword}
                           placeholder="Jelszó" password
                           onSubmit={doLogin}/>
                <PrimaryButton text="Bejelentkezés" onClick={doLogin}
                               disabled={!canLogin}/>
            </div>
        </div>
    );
}

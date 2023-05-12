import {useCallback, useContext, useMemo, useState} from "react";
import {TextInput} from "../components/inputs/TextInput";
import {PrimaryButton} from "../components/inputs/PrimaryButton";
import {AuthContext} from "../api/auth";

export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {login} = useContext(AuthContext);

    const canLogin = useMemo(() => {
        return ["admin", "allitobiro", "idorogzito", "speaker"].includes(username);
    }, [username]);

    const doLogin = useCallback(() => {
        login(username, password).then(u => console.log(u));
    }, [username, password, login]);

    return (
        <div className="w-screen h-screen grid place-content-center">
            <div className="flex flex-col gap-4 items-center">
                <TextInput value={username} onValue={setUsername}
                           placeholder="Felhasználónév"/>
                <TextInput value={password} onValue={setPassword}
                           placeholder="Jelszó"/>
                <PrimaryButton text="Bejelentkezés" onClick={doLogin} disabled={!canLogin}/>
            </div>
        </div>
    );
}

import {ReactNode, useCallback, useEffect, useState} from "react";
import {UserDetails} from "../types/UserDetails";
import {AuthContext, login} from "../api/auth";
import {UserRole} from "../types/UserRole";

function AuthProvider(props: {
    children: ReactNode
}) {
    const [user, setUser] = useState<UserDetails>();

    const doLogin = useCallback(
        (username: string, password: string): Promise<UserDetails> => {
            if (!username || !password) {
                throw new Error("Hiányos felhasználónév vagy jelszó.");
            }

            return login(username as UserRole, password).then(user => {
                setUser(user);
                sessionStorage.setItem("auth_data", JSON.stringify(user));
                return user;
            });
        }, []
    );

    const doLogout = useCallback((): Promise<void> => {
        return new Promise(resolve => {
            setUser(undefined);
            sessionStorage.removeItem("auth_data");
            resolve();
        });
    }, []);

    useEffect(() => {
        const data = sessionStorage.getItem("auth_data");
        if (!!data) {
            setUser(JSON.parse(data));
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user: user,
            login: doLogin,
            logout: doLogout
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

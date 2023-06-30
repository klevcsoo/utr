import {useCallback, useState} from "react";
import {UserDetails} from "../types/UserDetails";
import {AuthContext, login} from "../api/auth";
import {UserRole} from "../types/UserRole";
import {CommonChildrenOnlyProps} from "../types/componentProps/common/CommonChildrenOnlyProps";

const AUTH_DATA_KEY = "auth_data";

function AuthProvider(props: CommonChildrenOnlyProps) {
    const [user, setUser] = useState<UserDetails | undefined>(
        !!sessionStorage.getItem(AUTH_DATA_KEY) ? (
            JSON.parse(sessionStorage.getItem(AUTH_DATA_KEY)!)
        ) : undefined
    );

    const doLogin = useCallback(
        (username: string, password: string): Promise<UserDetails> => {
            if (!username || !password) {
                throw new Error("Hiányos felhasználónév vagy jelszó.");
            }

            return login(username as UserRole, password).then(user => {
                setUser(user);
                sessionStorage.setItem(AUTH_DATA_KEY, JSON.stringify(user));
                return user;
            });
        }, []
    );

    const doLogout = useCallback((): Promise<void> => {
        return new Promise(resolve => {
            setUser(undefined);
            sessionStorage.removeItem(AUTH_DATA_KEY);
            resolve();
        });
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

import {useCallback, useState} from "react";
import {AuthUser} from "../../types/AuthUser";
import {AuthContext, login} from "../../auth/api";
import {UserRole} from "../../types/UserRole";
import {CommonChildrenOnlyProps} from "../../types/componentProps/common/CommonChildrenOnlyProps";

import {useTranslation} from "../../translations/hooks";

const AUTH_DATA_KEY = "auth_data";

function AuthProvider(props: CommonChildrenOnlyProps) {
    const t = useTranslation();

    const [user, setUser] = useState<AuthUser | undefined>(
        !!sessionStorage.getItem(AUTH_DATA_KEY) ? (
            JSON.parse(sessionStorage.getItem(AUTH_DATA_KEY)!)
        ) : undefined
    );

    const doLogin = useCallback(
        (username: string, password: string): Promise<AuthUser> => {
            if (!username || !password) {
                throw new Error(t("error.auth.missing_username_or_pass"));
            }

            return login(username as UserRole, password).then(user => {
                setUser(user);
                sessionStorage.setItem(AUTH_DATA_KEY, JSON.stringify(user));
                return user;
            });
        }, [t]
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

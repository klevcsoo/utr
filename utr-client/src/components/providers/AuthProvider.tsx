import {useCallback, useState} from "react";
import {AuthContext, login} from "../../lib/api/auth";
import {UserRole} from "../../types/UserRole";
import {CommonChildrenOnlyProps} from "../../types/componentProps/common/CommonChildrenOnlyProps";
import {useTranslation} from "../../hooks/translations/useTranslation";
import {UserRecord} from "../../types/UserRecord";

const AUTH_DATA_KEY = "auth_data";

export function AuthProvider(props: CommonChildrenOnlyProps) {
    const t = useTranslation();

    const [user, setUser] = useState<UserRecord | undefined>(
        !!sessionStorage.getItem(AUTH_DATA_KEY) ? (
            JSON.parse(sessionStorage.getItem(AUTH_DATA_KEY)!)
        ) : undefined
    );

    const doLogin = useCallback(
        async (username: string, password: string): Promise<void> => {
            if (!username || !password) {
                throw new Error(t("error.auth.missing_username_or_pass"));
            }

            setUser(await login(username as UserRole, password));
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

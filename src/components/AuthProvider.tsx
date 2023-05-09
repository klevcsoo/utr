import {ReactNode, useCallback, useState} from "react";
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
                return user;
            });
        }, []
    );

    const doLogout = useCallback(() => {
        throw new Error("Not Implemented.");
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

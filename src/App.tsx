import React, {Fragment, ReactNode, useCallback, useContext} from 'react';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import AuthProvider from "./components/AuthProvider";
import {LoginPage} from "./pages/LoginPage";
import {AuthContext} from "./api/auth";
import {UserRole} from "./types/UserRole";

function App() {
    return (
        <BrowserRouter basename={"/client"}>
            <AuthProvider>
                <ContentRoot/>
            </AuthProvider>
        </BrowserRouter>
    );
}

function ContentRoot() {
    const {user} = useContext(AuthContext);

    const ifUser = useCallback((node: ReactNode, role?: UserRole): ReactNode => {
        return !!user && (!!role ? user.roles.includes(role) : true) ? node :
            <Navigate to="/login"/> as ReactNode;
    }, [user]);

    const ifNotUser = useCallback((node: ReactNode): ReactNode => {
        if (!user) {
            return node;
        } else {
            return <Navigate to="/"/> as ReactNode;
        }
    }, [user]);

    return (
        <Fragment>
            <div>hello</div>
            <Routes>
                <Route path="/" element={ifUser(<div>logged in</div>)}/>
                <Route path="/login" element={ifNotUser(<LoginPage/>)}/>
            </Routes>
        </Fragment>
    );
}

export default App;

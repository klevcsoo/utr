import React from 'react';
import {Outlet, Route, Routes} from "react-router-dom";
import {LoginPage} from "./pages/LoginPage";
import {CsapatokOverviewPage} from "./pages/CsapatokOverviewPage";
import {UnprotectedView} from "./components/UnprotectedView";
import {HeaderLayout} from "./layouts/HeaderLayout";
import {NavbarLayout} from "./layouts/NavbarLayout";
import {ProtectedView} from "./components/ProtectedView";
import {LandingPage} from "./pages/LandingPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={
                <ProtectedView>
                    <HeaderLayout/>
                    <LandingPage/>
                    <Outlet/>
                </ProtectedView>
            }>
                <Route path="overview" element={
                    <ProtectedView role="admin">
                        <NavbarLayout/>
                        <Outlet/>
                    </ProtectedView>
                }>
                    <Route path="csapatok" element={<CsapatokOverviewPage/>}/>
                </Route>
            </Route>
            <Route path="/login" element={
                <UnprotectedView>
                    <LoginPage/>
                </UnprotectedView>
            }/>
        </Routes>
    );
}

export default App;

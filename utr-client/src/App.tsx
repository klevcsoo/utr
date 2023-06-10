import React from 'react';
import {Outlet, Route, Routes} from "react-router-dom";
import {LoginPage} from "./pages/LoginPage";
import {CsapatokOverviewPage} from "./pages/overview/csapatok/CsapatokOverviewPage";
import {UnprotectedView} from "./components/UnprotectedView";
import {ProtectedView} from "./components/ProtectedView";
import {NyitottVersenyPage} from "./pages/NyitottVersenyPage";
import {AdminLayout} from "./layouts/AdminLayout";
import {CsapatDetailsPage} from "./pages/overview/csapatok/CsapatDetailsPage";
import {UszoversenyekOverviewPage} from "./pages/overview/uszoversenyek/UszoversenyekOverviewPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={
                <ProtectedView>
                    <Outlet/>
                </ProtectedView>
            }>
                <Route index element={<NyitottVersenyPage/>}/>
                <Route path="overview" element={
                    <ProtectedView role="admin">
                        <AdminLayout/>
                    </ProtectedView>
                }>
                    <Route path="versenyek" element={<UszoversenyekOverviewPage/>}/>
                    <Route path="csapatok" element={<CsapatokOverviewPage/>}/>
                    <Route path="csapatok/:id/*" element={<CsapatDetailsPage/>}/>
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

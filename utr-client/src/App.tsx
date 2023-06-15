import React from 'react';
import {Outlet, Route, Routes} from "react-router-dom";
import {LoginPage} from "./pages/login";
import {CsapatokIndexPage} from "./pages/admin/csapatok";
import {UnprotectedView} from "./components/UnprotectedView";
import {ProtectedView} from "./components/ProtectedView";
import {IndexPage} from "./pages";
import {AdminLayout} from "./layouts/AdminLayout";
import {CsapatSlugPage} from "./pages/admin/csapatok/[:id]";
import {UszoversenyekIndexPage} from "./pages/admin/uszoversenyek";
import {AdminIndexPage} from "./pages/admin";

function App() {
    return (
        <Routes>
            <Route path="/" element={
                <ProtectedView>
                    <Outlet/>
                </ProtectedView>
            }>
                <Route index element={<IndexPage/>}/>
                <Route path="admin" element={
                    <ProtectedView role="admin">
                        <AdminLayout/>
                    </ProtectedView>
                }>
                    <Route path="" element={<AdminIndexPage/>}/>
                    <Route path="versenyek" element={<UszoversenyekIndexPage/>}/>
                    <Route path="csapatok" element={<CsapatokIndexPage/>}/>
                    <Route path="csapatok/:id" element={<CsapatSlugPage/>}/>
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

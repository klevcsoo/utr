import React from 'react';
import {Navigate, Outlet, Route, Routes} from "react-router-dom";
import {ProtectedView, UnprotectedView} from "./components/providers";
import {ACCESS_LEVEL_ADMIN} from "./lib/api/auth";
import LiveViewPage from "./pages/LiveViewPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminIndexPage from "./pages/AdminIndexPage";
import UszoversenyekIndexPage from "./pages/UszoversenyekIndexPage";
import UszoversenyekSlugPage from "./pages/UszoversenyekSlugPage";
import VersenyszamokSlugPage from "./pages/VersenyszamokSlugPage";
import CsapatokIndexPage from "./pages/CsapatokIndexPage";
import CsapatokSlugPage from "./pages/CsapatokSlugPage";
import SettingsPage from "./pages/SettingsPage";
import SupportPage from "./pages/SupportPage";
import LoginPage from "./pages/LoginPage";
import Error404Page from "./pages/Error404Page";

function App() {
    return (
        <Routes>
            <Route path="/" element={
                <ProtectedView>
                    <Outlet/>
                </ProtectedView>
            }>
                <Route index element={<Navigate to="live" relative="path"/>}/>
                <Route path="live" element={<LiveViewPage/>}/>
                <Route path="admin" element={
                    <ProtectedView accessLevel={ACCESS_LEVEL_ADMIN}>
                        <AdminLayout/>
                    </ProtectedView>
                }>
                    <Route index element={<AdminIndexPage/>}/>
                    <Route path="uszoversenyek">
                        <Route index element={<UszoversenyekIndexPage/>}/>
                        <Route path=":id">
                            <Route index element={<UszoversenyekSlugPage/>}/>
                            <Route path="versenyszamok">
                                <Route index element={<Navigate to=".."
                                                                relative="path"/>}/>
                                <Route path=":id" element={<VersenyszamokSlugPage/>}/>
                            </Route>
                        </Route>
                    </Route>
                    <Route path="csapatok">
                        <Route index element={<CsapatokIndexPage/>}/>
                        <Route path=":id" element={<CsapatokSlugPage/>}/>
                    </Route>
                    <Route path="settings/*" element={<SettingsPage/>}/>
                    <Route path="support/*" element={<SupportPage/>}/>
                </Route>
            </Route>
            <Route path="/login" element={
                <UnprotectedView>
                    <LoginPage/>
                </UnprotectedView>
            }/>
            <Route path="*" element={<Error404Page/>}/>
        </Routes>
    );
}

export default App;

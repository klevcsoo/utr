import React from 'react';
import {Navigate, Outlet, Route, Routes} from "react-router-dom";
import {LoginPage} from "./pages/LoginPage";
import {CsapatokIndexPage} from "./pages/CsapatokIndexPage";
import {UnprotectedView} from "./components/providers/UnprotectedView";
import {ProtectedView} from "./components/providers/ProtectedView";
import {LiveViewPage} from "./pages/LiveViewPage";
import {AdminLayout} from "./layouts/AdminLayout";
import {CsapatokSlugPage} from "./pages/CsapatokSlugPage";
import {UszoversenyekIndexPage} from "./pages/UszoversenyekIndexPage";
import {AdminIndexPage} from "./pages/AdminIndexPage";
import {UszoversenyekSlugPage} from "./pages/UszoversenyekSlugPage";
import {VersenyszamokSlugPage} from "./pages/VersenyszamokSlugPage";
import {Error404Page} from "./pages/Error404Page";
import {SupportPage} from "./pages/SupportPage";
import {SettingsPage} from "./pages/SettingsPage";

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
                    <ProtectedView role="admin">
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

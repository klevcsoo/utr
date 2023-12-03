import React from 'react';
import {Navigate, Outlet, Route, Routes} from "react-router-dom";
import {LoginPage} from "./auth/pages/LoginPage";
import {CsapatokIndexPage} from "./csapatok/pages/CsapatokIndexPage";
import {UnprotectedView} from "./utils/components/providers/UnprotectedView";
import {ProtectedView} from "./utils/components/providers/ProtectedView";
import {LiveViewPage} from "./live/pages/LiveViewPage";
import {AdminLayout} from "./utils/components/AdminLayout";
import {CsapatokSlugPage} from "./csapatok/pages/CsapatokSlugPage";
import {UszoversenyekIndexPage} from "./uszoversenyek/pages/UszoversenyekIndexPage";
import {AdminIndexPage} from "./utils/pages/AdminIndexPage";
import {UszoversenyekSlugPage} from "./uszoversenyek/pages/UszoversenyekSlugPage";
import {VersenyszamokSlugPage} from "./versenyszamok/pages/VersenyszamokSlugPage";
import {Error404Page} from "./utils/pages/Error404Page";
import {SupportPage} from "./support/pages/SupportPage";
import {SettingsPage} from "./auth/pages/SettingsPage";
import {UszoversenyRouteProvider} from "./uszoversenyek/components/UszoversenyRouteProvider";
import {VersenyszamRouteProvider} from "./versenyszamok/components/VersenyszamRouteProvider";
import {CsapatRouteProvider} from "./csapatok/components/CsapatRouteProvider";

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
                        <Route path=":uszoversenyId" element={<UszoversenyRouteProvider/>}>
                            <Route index element={<UszoversenyekSlugPage/>}/>
                            <Route path="versenyszamok">
                                <Route index element={<Navigate to=".."
                                                                relative="path"/>}/>
                                <Route path=":versenyszamId" element={<VersenyszamRouteProvider/>}>
                                    <Route index element={<VersenyszamokSlugPage/>}/>
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                    <Route path="csapatok">
                        <Route index element={<CsapatokIndexPage/>}/>
                        <Route path=":csapatId" element={<CsapatRouteProvider/>}>
                            <Route index element={<CsapatokSlugPage/>}/>
                        </Route>
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

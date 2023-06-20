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
import {UszoversenyekSlugPage} from "./pages/admin/uszoversenyek/[:id]";
import {UszoversenyVersenyszamokSlugPage} from "./pages/admin/uszoversenyek/versenyszamok/[:id]";

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
                    <Route path="versenyek">
                        <Route path="" element={<UszoversenyekIndexPage/>}/>
                        <Route path=":id">
                            <Route path="" element={<UszoversenyekSlugPage/>}/>
                            <Route path="versenyszamok">
                                <Route path=":id" element={<UszoversenyVersenyszamokSlugPage/>}/>
                            </Route>
                        </Route>
                    </Route>
                    <Route path="csapatok">
                        <Route path="" element={<CsapatokIndexPage/>}/>
                        <Route path=":id" element={<CsapatSlugPage/>}/>
                    </Route>
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

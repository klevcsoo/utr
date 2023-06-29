import React from 'react';
import {Navigate, Outlet, Route, Routes} from "react-router-dom";
import {LoginPage} from "./pages/LoginPage";
import {CsapatokIndexPage} from "./pages/CsapatokIndexPage";
import {UnprotectedView} from "./components/UnprotectedView";
import {ProtectedView} from "./components/ProtectedView";
import {IndexPage} from "./pages/IndexPage";
import {AdminLayout} from "./layouts/AdminLayout";
import {CsapatokSlugPage} from "./pages/CsapatokSlugPage";
import {UszoversenyekIndexPage} from "./pages/UszoversenyekIndexPage";
import {AdminIndexPage} from "./pages/AdminIndexPage";
import {UszoversenyekSlugPage} from "./pages/UszoversenyekSlugPage";
import {VersenyszamokSlugPage} from "./pages/VersenyszamokSlugPage";

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
                                <Route path="" element={<Navigate to=".."
                                                                  relative="path"/>}/>
                                <Route path=":id" element={<VersenyszamokSlugPage/>}/>
                            </Route>
                        </Route>
                    </Route>
                    <Route path="csapatok">
                        <Route path="" element={<CsapatokIndexPage/>}/>
                        <Route path=":id" element={<CsapatokSlugPage/>}/>
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

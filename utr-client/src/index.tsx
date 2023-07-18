import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import AuthProvider from "./components/AuthProvider";
import {EnvironmentBanner} from "./components/EnvironmentBanner";
import {TranslationProvider} from "./components/TranslationProvider";
import {startApiPollEventTimer} from "./lib/apiPolling";

startApiPollEventTimer();

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <TranslationProvider>
        <AuthProvider>
            <EnvironmentBanner/>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </AuthProvider>
    </TranslationProvider>
);

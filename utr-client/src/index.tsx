import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {AuthProvider, TranslationProvider} from "./components/providers";
import {startApiPollEventTimer} from "./lib/apiPolling";
import {ThemeProvider} from "@material-tailwind/react";

startApiPollEventTimer();

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <ThemeProvider>
        <TranslationProvider>
            <AuthProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </AuthProvider>
        </TranslationProvider>
    </ThemeProvider>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import AuthProvider from "./auth/components/AuthProvider";
import {TranslationProvider} from "./translations/components/TranslationProvider";
import {startApiPollEventTimer} from "./utils/lib/apiPolling";
import {
    CardFooterStylesType,
    CardHeaderStylesType,
    CardStylesType,
    ChipStylesType,
    ThemeProvider
} from "@material-tailwind/react";

startApiPollEventTimer();

const theme = {
    card: {
        defaultProps: {
            color: "white"
        },
        styles: {
            base: {
                initial: {
                    w: "w-full",
                    p: "p-0"
                }
            }
        }
    } as CardStylesType,
    cardHeader: {
        defaultProps: {
            color: "white",
            floated: false,
            shadow: false
        },
        styles: {
            base: {
                initial: {
                    border: "border-b border-blue-gray-50",
                    m: "m-0",
                    p: "p-6",
                    rounded: "rounded-b-none",
                    text: "text-center"
                }
            }
        }
    } as CardHeaderStylesType,
    cardFooter: {
        defaultProps: {
            divider: true
        }
    } as CardFooterStylesType,
    chip: {
        defaultProps: {
            variant: "ghost"
        },
        styles: {
            base: {
                chip: {
                    w: "w-min"
                }
            }
        }
    } as ChipStylesType
};

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <ThemeProvider value={theme}>
        <TranslationProvider>
            <AuthProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </AuthProvider>
        </TranslationProvider>
    </ThemeProvider>
);

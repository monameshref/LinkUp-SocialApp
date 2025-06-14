"use client";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/reduxStore';
import { ToastContainer } from 'react-toastify';
import Navbar from './_Components/Navbar/Navbar';
import "./globals.css";


export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <AppRouterCacheProvider>
            <Provider store={store}>
                <Navbar />
                {children}
                <ToastContainer theme="colored" autoClose={1000} />
            </Provider>
        </AppRouterCacheProvider>
    );
}

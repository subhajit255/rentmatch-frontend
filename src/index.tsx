import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient"
import "./assets/css/globalstyle.css";
import "animate.css";
import './index.css';                 // Tailwind CSS last

import App from './components/app';
import { Toaster } from './context/ToastProvider';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/modalProvider';
import CommonDialog from './components/modals/commonModal';
import { SheetProvider } from './context/sheetProvider';
import CommonDrawer from './components/drawer/commonSheet';
import { BrowserRouter } from 'react-router-dom';
import { GoogleMapsProvider } from './context/GoogleMapsProvider';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* <Providers> */}
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ModalProvider>
            <SheetProvider>
              <GoogleMapsProvider>
                <App />
              </GoogleMapsProvider>
              <CommonDialog />
              <Toaster />
              <CommonDrawer />
            </SheetProvider>
          </ModalProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
    {/* </Providers> */}
  </React.StrictMode>
);



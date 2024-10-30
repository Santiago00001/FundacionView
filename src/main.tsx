import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; // Importar SnackbarProvider

import App from './app';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <HelmetProvider>
      <SnackbarProvider maxSnack={3}> {/* Agregar SnackbarProvider aquí */}
        <BrowserRouter>
          <Suspense>
            <App />
          </Suspense>
        </BrowserRouter>
      </SnackbarProvider>
    </HelmetProvider>
  </StrictMode>
);
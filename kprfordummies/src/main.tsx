import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../app/Home';
import NotFound from '../app/NotFound';
import { ExternalRedirect } from '../app/ExternalRedirect';
import '../app/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/bilbatez.dev"
          element={<ExternalRedirect to="https://bilbatez.dev" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

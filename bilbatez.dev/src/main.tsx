import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../app/Layout';
import { Home } from '../app/Home';
import { Experience } from '../app/Experience';
import { Projects } from '../app/Projects';
import { NotFound } from '../app/NotFound';
import { ExternalRedirect } from '../app/ExternalRedirect';
import '../app/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route
            path="/github"
            element={<ExternalRedirect to="https://github.com/bilbatez" />}
          />
          <Route
            path="/linkedin"
            element={
              <ExternalRedirect to="https://www.linkedin.com/in/albertjt/" />
            }
          />
          <Route
            path="/bofa"
            element={
              <ExternalRedirect to="https://about.bankofamerica.com/en/our-company" />
            }
          />
          <Route
            path="/shopee"
            element={<ExternalRedirect to="https://careers.shopee.sg/about" />}
          />
          <Route
            path="/blibli"
            element={
              <ExternalRedirect to="https://about.blibli.com/en/about" />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

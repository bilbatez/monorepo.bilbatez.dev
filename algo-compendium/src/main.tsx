import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../app/Layout';
import { Home } from '../app/Home';
import { CategoryList } from '../app/CategoryList';
import { AlgorithmDetail } from '../app/AlgorithmDetail';
import { NotFound } from '../app/NotFound';
import { LanguageProvider } from '../app/_i18n';
import '../app/globals.css';
import '../_algorithms/sorting';
import '../_algorithms/searching';
import '../_algorithms/tree';
import '../_algorithms/graph';
import '../_algorithms/dynamic-programming';
import '../_algorithms/backtracking';
import '../_algorithms/string-matching';
import '../_algorithms/math';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/sorting"
              element={<CategoryList category="sorting" />}
            />
            <Route path="/sorting/:slug" element={<AlgorithmDetail />} />
            <Route
              path="/searching"
              element={<CategoryList category="searching" />}
            />
            <Route path="/searching/:slug" element={<AlgorithmDetail />} />
            <Route path="/graph" element={<CategoryList category="graph" />} />
            <Route path="/graph/:slug" element={<AlgorithmDetail />} />
            <Route path="/tree" element={<CategoryList category="tree" />} />
            <Route path="/tree/:slug" element={<AlgorithmDetail />} />
            <Route
              path="/dynamic-programming"
              element={<CategoryList category="dynamic-programming" />}
            />
            <Route
              path="/dynamic-programming/:slug"
              element={<AlgorithmDetail />}
            />
            <Route
              path="/string-matching"
              element={<CategoryList category="string-matching" />}
            />
            <Route
              path="/string-matching/:slug"
              element={<AlgorithmDetail />}
            />
            <Route
              path="/backtracking"
              element={<CategoryList category="backtracking" />}
            />
            <Route path="/backtracking/:slug" element={<AlgorithmDetail />} />
            <Route path="/math" element={<CategoryList category="math" />} />
            <Route path="/math/:slug" element={<AlgorithmDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>
);

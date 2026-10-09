import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import './i18n.js'
import App from './App.jsx'
import Seo from './Seo.jsx'
import { languageFromPath } from './seo.js'
import KonobarPage from './ProductPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={languageFromPath(window.location.pathname) === 'mk' ? '/mk' : '/'}>
      <Seo />
      <Routes>
        <Route path="/products/konobar" element={<KonobarPage />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

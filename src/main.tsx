import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { queryClient } from './shared/lib/queryClient'
import './index.css'
import App from './App.tsx'
import { initEmbedMessenger } from './utils/embedMessenger';

console.log("INIT EMBED MESSENGER EJECUTADO");
console.log("URL actual:", window.location.href);
console.log("Search params:", window.location.search);
console.log("embed =", new URLSearchParams(window.location.search).get("embed"));
initEmbedMessenger();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" richColors closeButton />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)

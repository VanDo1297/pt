import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RestTimerProvider } from './context/RestTimer'

import { registerSW } from "virtual:pwa-register";

registerSW({
  onNeedRefresh() {
    console.log("New content available");
  },
  onOfflineReady() {
    console.log("App ready offline");
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RestTimerProvider>
      <App />
    </RestTimerProvider>
  </StrictMode>,
)

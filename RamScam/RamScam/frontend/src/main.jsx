import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RamProvider } from './context/RamProvider';
import './styles/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RamProvider>
      <App />
    </RamProvider>
  </StrictMode>,
)
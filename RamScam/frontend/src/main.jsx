import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RamProvider } from './context/RamProvider';
import './styles/index.css'
import App from './App.jsx'
import { ShardProvider } from './context/ShardProvider.jsx';
import { BuffProvider } from './context/BuffProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RamProvider>
      <ShardProvider>
        <BuffProvider>
          <App />
        </BuffProvider>
      </ShardProvider>
    </RamProvider>
  </StrictMode>,
)
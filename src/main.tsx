import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/mona-sans'
import './index.css'
import App from './App.tsx'

// Error boundary for debugging
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

console.log('Starting app...');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  console.log('Root element found, creating root...');
  const root = createRoot(rootElement);
  
  console.log('Rendering App component...');
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error rendering app:', error);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: monospace; background: #fff; color: #000;">
        <h1>Error loading application</h1>
        <pre style="background: #f0f0f0; padding: 10px; border-radius: 4px;">${error instanceof Error ? error.stack : String(error)}</pre>
      </div>
    `;
  }
}

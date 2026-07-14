import ReactDOM from 'react-dom/client';
import { Overlay } from '@/components/extension/overlay';
import '@/app/globals.css';

// Create a container for the overlay
const container = document.createElement('div');
container.id = 'misinformation-detector-overlay';
container.style.all = 'initial';
document.body.appendChild(container);

// Mount React component
const root = ReactDOM.createRoot(container);
root.render(<Overlay />);

console.log('[v0] Overlay UI mounted');

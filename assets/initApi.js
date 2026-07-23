import { initApiUrl } from './config.js';

// Inicializa a API URL antes de qualquer outra coisa
await initApiUrl();

// Dispara um evento customizado para avisar que a API está pronta
window.dispatchEvent(new CustomEvent('apiReady'));
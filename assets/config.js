// export const API_URL = 'https://hitachi-refine-museums-convert.trycloudflare.com'
const GIST_ID = 'c695194f270beb73384b82b9efc7ee90';
const GIST_URL = `https://gist.githubusercontent.com/Bebel132/${GIST_ID}/raw/pirambu-api.json`;

export let API_URL = '';

export function redirectToServiceUnavailable() {
    if (window.location.pathname.endsWith('/pages/503.html')) return;

    window.location.replace(new URL('../pages/503.html', import.meta.url).href);
}

export async function initApiUrl() {
    try {
        const response = await fetch(`${GIST_URL}?t=${Date.now()}`);
        if (!response.ok) throw new Error(`Configuração da API indisponível (${response.status})`);

        const data = await response.json();
        if (!data.api_url) throw new Error('URL da API não encontrada');

        API_URL = String(data.api_url).replace(/\/+$/, '');
    } catch (error) {
        console.error('Erro ao carregar API URL:', error);
        API_URL = '';
        redirectToServiceUnavailable();
    }
}

// export const API_URL = 'http://127.0.0.1:5000'

// caminho base do projeto
export const BASE_PATH = '';

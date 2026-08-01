// export const API_URL = 'https://hitachi-refine-museums-convert.trycloudflare.com'
const GIST_ID = 'c695194f270beb73384b82b9efc7ee90';
const GIST_URL = `https://gist.githubusercontent.com/Bebel132/${GIST_ID}/raw/pirambu-api.json`;

export let API_URL = '';

export async function initApiUrl() {
    try {
        API_URL = await fetch(`${GIST_URL}?t=${Date.now()}`).then(res => res.json()).then(data => data.api_url+"");
    } catch (error) {
        console.error('Erro ao carregar API URL:', error);
        // Fallback para desenvolvimento
        API_URL = 'http://localhost:5000';
    }
}

// export const API_URL = 'http://127.0.0.1:5000'

// caminho base do projeto
export const BASE_PATH = '';

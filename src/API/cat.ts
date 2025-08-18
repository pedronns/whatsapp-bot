import fetch from 'node-fetch';

export interface CatResponse {
  id: string; // geralmente é string na API
  url: string;
  width?: number;
  height?: number;
}

export async function getCat(): Promise<string | null> {
  try {
    const response = await fetch('https://api.thecatapi.com/v1/images/search');
    const data = (await response.json()) as CatResponse[];

    const cat = data[0];
    return cat?.url ?? null;
  } catch (error) {
    console.error('Erro ao buscar gato:', error);
    return null;
  }
}

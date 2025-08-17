import fetch from 'node-fetch';

export interface FactResponse {
  text: string;
}

export async function getFunFact(): Promise<string | null> {
  try {
    const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
    const data = (await response.json()) as FactResponse;
    return data.text;
  } catch (error) {
    console.error('Erro ao buscar fato:', error);
    return null;
  }
}

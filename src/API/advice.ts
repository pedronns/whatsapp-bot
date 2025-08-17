import fetch from 'node-fetch';

export interface AdviceResponse {
	slip: {
		id: number;
		advice: string;
	};
}

export async function getAdvice(): Promise<string | null> {
  try {
    const response = await fetch('https://api.adviceslip.com/advice')
    const data = (await response.json()) as AdviceResponse;
    return data.slip.advice
  } catch (error) {
    console.error('Erro ao buscar conselho:', error)
    return null
  }
}

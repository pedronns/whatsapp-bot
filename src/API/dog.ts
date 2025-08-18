import fetch from 'node-fetch';

export interface DogResponse {
  message: string;
  status: string
}

export async function getDog(): Promise<string | null> {
  try {
		const response = await fetch('https://dog.ceo/api/breeds/image/random');
		const data = (await response.json()) as DogResponse;

		const dog = data.message;
		return dog ?? null;
	} catch (error) {
		console.error('Erro ao buscar cachorro:', error);
		return null;
	}
}

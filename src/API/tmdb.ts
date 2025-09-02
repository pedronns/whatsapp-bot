import fetch, { RequestInit } from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TMDB_API_TOKEN;

interface Movie {
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  overview: string
  popularity: number
}
interface MovieSearchResponse {
	page: number;
	results: Movie[];
	total_pages: number;
	total_results: number;
}

const url =
	'https://api.themoviedb.org/3/search/movie?include_adult=false&language=pt-BR&page=1';
const options: RequestInit = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${token}`,
	},
};

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
	const response = await fetch(url, options);
	if (!response.ok) {
		throw new Error(`Erro HTTP: ${response.status}`);
	}
	return response.json() as Promise<T>;
}

export async function getMovie(query: string): Promise<Movie | null> {
	try {
		const data = await fetchJson<MovieSearchResponse>(
			`${url}&query=${encodeURIComponent(query)}`,
			options
		);

		const results = data.results

		// TODO: weighted sort considering date, popularity and query similarity
		const movie = results.sort((a, b) => b.popularity - a.popularity)[0]

		return movie


	} catch (error: any) {
		console.log('Erro ao buscar filme', error);
		return null;
	}
}



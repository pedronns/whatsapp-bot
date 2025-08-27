import dotenv from 'dotenv'
import { request } from 'express';
import { createModule, createMethod } from "kozz-module-maker";
import { getMovie } from 'src/API/tmdb';
dotenv.config()

interface Movie {
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  popularity: number;
}

const gatewayUrl = process.env.GATEWAY_URL ?? ''
const socketPath = process.env.SOCKET_PATH ?? ''

const helpMessage = `📌 *!movie [nome]*  
🎞️ Mostra informações sobre o filme pesquisado.  
Ex.: \`!movie matrix\``;

const mainMethod = createMethod('fallback', async requester => {
	const query = requester.message.body.replace(/^!\s*movie\s+/i, '').trim();

	if (!query) {
		return requester.reply(helpMessage);
	}

	const movie = await getMovie(query);

	const movieReplies = [
		`🚀 Nem na galáxia mais distante eu encontrei "${query}".`,
		`👻 Quem você vai chamar? Pois eu não achei "${query}".`,
		`🦖 Nem os dinossauros encontraram "${query}".`,
		`🌌 Que a força esteja com você! Mas "${query}" não está.`,
		`🕶️ Parece que "${query}" não faz parte da Matrix.`,
		`🐠 Continue a nadar... até encontrar "${query}"`,
	];

	if (!movie) {
		const reply = movieReplies[Math.floor(Math.random() * movieReplies.length)];
		return requester.reply(reply);
	}

	const posterBaseUrl = 'https://image.tmdb.org/t/p/';
	const size = 'w500';
	const posterPath = movie.poster_path;

	const posterFullUrl = posterPath ? `${posterBaseUrl}${size}${posterPath}` : '';

	function createMovieCaption(movie: Movie): string {
		const releaseYear = movie.release_date
			? movie.release_date.split('-')[0]
			: 'Desconhecido';
		const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
		const releaseDate = movie.release_date
			? movie.release_date.split('-').reverse().join('/')
			: 'Sem descrição disponível.';
		const overview = movie.overview ? movie.overview : 'Sem descrição disponível.';

		return (
			`*${movie.title}* (${releaseYear})\n` +
			`⭐ Nota: ${rating}${rating !== 'N/A' ? '/10' : ''} (TMDB)\n` +
			`🎬 Lançamento: ${releaseDate}\n\n` +
			`${overview}`
		);
	}

	const caption = createMovieCaption(movie);

	if (posterFullUrl) {
		return requester.reply.withMedia.fromUrl(posterFullUrl, 'image', caption);
	} else {
		return requester.reply(caption);
	}
});

export const startMovieModule = () => {
	const instance = createModule({
		name: 'movie',
		address: gatewayUrl,
		customSocketPath: socketPath,
		commands: {
			boundariesToHandle: ['*'],
			methods: {
				...createMethod('default', async requester => {
					requester.reply(helpMessage);
				}),
				...createMethod('help', requester => {
					requester.reply(helpMessage);
				}),
				...mainMethod,
			},
		},
	});

	return instance;
};

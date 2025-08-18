import { createModule, createMethod } from "kozz-module-maker";
const defaultGatewayUrl = 'ws://localhost:4521';

import { getCat } from "src/API/cat";

const helpMessage = `📌 *!cat*  
🐱 Mostra uma imagem aleatória de um gato.  
Ex.: \`!cat\``;


export const startCatModule = () => {
	const instance = createModule({
		name: 'cat',
		address: defaultGatewayUrl,
		customSocketPath: '/socket.io/',
		commands: {
			boundariesToHandle: ['*'],
			methods: {
				...createMethod('default', async requester => {
					const catImage = await getCat()

					if(catImage) {
						requester.reply.withMedia.fromUrl(catImage, 'image');
					} else {
						requester.reply('Não foi possível encontrar uma imagem de gato 😿')
					}
				}),
				...createMethod('help', requester => {
					requester.reply(helpMessage)
				})
			},
		},
	});

	return instance;
};

import { createModule, createMethod } from "kozz-module-maker";
const defaultGatewayUrl = 'ws://localhost:4521';

import { getDog } from "src/API/dog";

const helpMessage = `📌 *!dog*  
🐶 Mostra uma imagem aleatória de um cachorro.  
Ex.: \`!dog\``;


export const startDogModule = () => {
	const instance = createModule({
		name: 'dog',
		address: defaultGatewayUrl,
		customSocketPath: '/socket.io/',
		commands: {
			boundariesToHandle: ['*'],
			methods: {
				...createMethod('default', async requester => {
					const dogImage = await getDog()

					if(dogImage) {
						requester.reply.withMedia.fromUrl(dogImage, 'image');
					} else {
						requester.reply('Não foi possível encontrar uma imagem de cachorro 🐶')
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

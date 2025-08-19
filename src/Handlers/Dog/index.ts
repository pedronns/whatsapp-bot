import dotenv from 'dotenv'
import { createModule, createMethod } from "kozz-module-maker";
import { getDog } from "src/API/dog";

dotenv.config()

const gatewayUrl = process.env.GATEWAY_URL ?? ''
const socketPath = process.env.SOCKET_PATH ?? ''

const helpMessage = `📌 *!dog*  
🐶 Mostra uma imagem aleatória de um cachorro.  
Ex.: \`!dog\``;


export const startDogModule = () => {
	const instance = createModule({
		name: 'dog',
		address: gatewayUrl,
		customSocketPath: socketPath,
		commands: {
			boundariesToHandle: ['*'],
			methods: {
				...createMethod('default', async requester => {
					requester.react('⏳')
					const dogImage = await getDog()

					if(dogImage) {
						requester.reply.withMedia.fromUrl(dogImage, 'image');
						requester.react('✔️');
					} else {
						requester.reply('Não foi possível encontrar uma imagem de cachorro 🐶')
						requester.react('⚠️');
					}
				}),
				...createMethod('help', requester => {
					requester.react('❓')
					requester.reply(helpMessage)
				})
			},
		},
	});

	return instance;
};

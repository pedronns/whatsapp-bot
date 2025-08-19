import dotenv from 'dotenv'
import { createModule, createMethod } from "kozz-module-maker";
import { getCat } from "src/API/cat";

dotenv.config()

const gatewayUrl = process.env.GATEWAY_URL ?? ''
const socketPath = process.env.SOCKET_PATH ?? ''

const helpMessage = `📌 *!cat*  
🐱 Mostra uma imagem aleatória de um gato.  
Ex.: \`!cat\``;


export const startCatModule = () => {
	const instance = createModule({
		name: 'cat',
		address: gatewayUrl,
		customSocketPath: socketPath,
		commands: {
			boundariesToHandle: ['*'],
			methods: {
				...createMethod('default', async requester => {
					requester.react('⏳');

					const catImage = await getCat()

					if(catImage) {
						requester.reply.withMedia.fromUrl(catImage, 'image');
						requester.react('✔️');
					} else {
						requester.react('⚠️');
						requester.reply('Não foi possível encontrar uma imagem de gato 😿')
					}
				}),
				...createMethod('help', requester => {
					requester.react('❓');
					requester.reply(helpMessage)
				})
			},
		},
	});

	return instance;
};

import dotenv from 'dotenv'
import { createModule, createMethod } from "kozz-module-maker";
import { getFunFact } from "src/API/funFact"; 

dotenv.config()

const gatewayUrl = process.env.GATEWAY_URL ?? ''
const socketPath = process.env.SOCKET_PATH ?? ''

const helpMessage = `📌 *!conselho*  
📝 Exibe um conselho aleatório (EN-US).  
Ex.: \`!fact\``;


export const startFunFactModule = () => {
	const instance = createModule({
		name: 'fact',
		address: gatewayUrl,
		customSocketPath: socketPath,
		commands: {
			boundariesToHandle: ['*'],
			methods: {
			...createMethod('default', async requester => {
				const advice = await getFunFact()
				requester.reply(advice || 'Não foi possível obter um fato curioso.')
			}),
			...createMethod('help', requester => {
				requester.reply(helpMessage)
			}),
		},
		},
	});

	return instance;
};
